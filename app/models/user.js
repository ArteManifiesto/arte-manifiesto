var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            fullname: DataTypes.STRING,
            gender: DataTypes.STRING,
            photo: DataTypes.STRING,
            cover: DataTypes.STRING,
            isArtist: {type: DataTypes.BOOLEAN, defaultValue: false},

            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            birthday: DataTypes.DATE,

            school: DataTypes.TEXT,

            facebook: DataTypes.STRING,
            behance: DataTypes.STRING,
            twitter: DataTypes.STRING,
            tumblr: DataTypes.STRING,

            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0},

            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,

            isAdmin: {type: DataTypes.BOOLEAN, defaultValue: false},
            verified: {type: DataTypes.BOOLEAN, defaultValue: false},
            filled: {type: DataTypes.BOOLEAN, defaultValue: false},

            tokenVerifyEmail: DataTypes.STRING,
            tokenResetPassword: DataTypes.STRING,
            tokenResetPasswordExpires: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    User.belongsToMany(models.Category, {as: 'Specialties', through: 'Specialties'});
                    User.belongsToMany(models.Category, {as: 'Interests', through: 'Interests'});

                    User.belongsToMany(models.User, {as: 'Followers', foreignKey: 'FollowingId', through: 'Followers'});
                    User.belongsToMany(models.User, {as: 'Followings', foreignKey: 'FollowerId', through: 'Followers'});

                    User.belongsToMany(models.User, {as: 'Viewings', foreignKey: 'ViewingId', through: 'Viewers'});
                    User.belongsToMany(models.User, {as: 'Viewers', foreignKey: 'ViewerId', through: 'Viewers'});

                    User.belongsToMany(models.Work, {as: 'WorkViews', through: 'WorkViews'});
                    User.belongsToMany(models.Work, {as: 'WorkLikes', through: 'WorkLikes'});
                    User.belongsToMany(models.Work, {as: 'WorkRequests', through: 'WorkRequests'});

                    User.hasMany(models.Collection, {onDelete: 'cascade'});
                    User.hasMany(models.Work, {onDelete: 'cascade'});
                    User.hasMany(models.Review);
                    User.hasMany(models.Action);
                }
            },
            instanceMethods: {
                makeSalt: function () {
                    return crypto.randomBytes(16).toString('base64');
                },
                authenticate: function (password) {
                    return this.encryptPassword(password, this.salt) === this.hashedPassword;
                },
                encryptPassword: function (password, salt) {
                    if (!password || !salt) return '';
                    salt = new Buffer(salt, 'base64');
                    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
                },
                makeTokenResetPassword: function () {
                    this.tokenResetPassword = uuid.v4();
                    this.tokenResetPasswordExpires = moment().add(1, 'hour');
                    return this.save();
                },
                follow: function (user) {
                    var scope = this;
                    user.popularity += 3;
                    var promises = [user.addFollower(this), user.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return user.numOfFollowers();
                    });
                },
                unFollow: function (user) {
                    var scope = this;
                    user.popularity -= 3;
                    var promises = [user.removeFollower(this), user.save()];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return user.numOfFollowers();
                    });
                },
                buildParts: function (options) {
                    var scope = this, worksQuery = {
                        attributes: ['id', 'name', 'nameSlugify', 'photo'],
                        where:{public: true},
                        limit: 4
                    };
                    return global.db.Sequelize.Promise.all([
                        scope.numOfFollowers(),
                        scope.numOfWorks(),
                        scope.following(options.viewer),
                        scope.getWorks(worksQuery)
                    ]).then(function (result) {
                        scope.setDataValue('numOfFollowers', result[0]);
                        scope.setDataValue('numOfWorks', result[1]);
                        scope.setDataValue('following', result[2]);
                        scope.setDataValue('Works', result[3]);
                    });
                },
                calcPopularity: function() {
                  return this.getWorks().then(function(works){
                    var promises = [];
                    for (var i = 0; i < works.length - 1; i++) {
                      promises.push(works[i].numOfLikes());
                    }
                    return global.db.Sequelize.Promise.all(promises).then(function (result) {
                      var total = 0;
                      for (var i = 0; i < result.length - 1; i++) {
                        total += parseInt(result[i], 10);
                      }
                      return total;
                    });
                  });
                },
                numOfWorks: function (options) {
                    options = options || {};
                    var query = {attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfWorks']]};
                    query = global._.assign(query, options);
                    return this.getWorks(query).then(function (result) {
                        return result[0].getDataValue('numOfWorks');
                    });
                },
                numOfCollections: function (options) {
                    options  = options || {};
                    var query = {attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfCollections']]};
                    query = _.assign(query, options);
                    return this.getCollections(query).then(function (result) {
                        return result[0].getDataValue('numOfCollections');
                    });
                },
                numOfFollowers: function () {
                  var query = {attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfFollowers']]};
                    return this.getFollowers(query).then(function (result) {
                        return result[0].getDataValue('numOfFollowers');
                    });
                },
                numOfFollowings: function () {
                  var query = {attributes: [[global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'numOfFollowings']]};
                    return this.getFollowings(query).then(function (result) {
                        return result[0].getDataValue('numOfFollowings');
                    });
                },
                following: function (viewer) {
                    var query = {where: {id: viewer}};
                    return this.getFollowers(query).then(function (followers) {
                        return followers.length > 0;
                    });
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    options.password = options.password || '123';
                    // if (user.email === 'juliocanares@gmail.com') {
                    //   user.isAdmin = true;
                    //   user.verified = true;
                    // }

                    user.username = 'am' + moment().format('DDMMYYhhmmss') + user.id;
                    user.photo = 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,q_70/am_avatar.jpg';
                    user.cover = 'http://res.cloudinary.com/arte-manifiesto/image/upload/c_limit,w_1600/general/am-cover.jpg';
                    user.salt = user.makeSalt();
                    user.hashedPassword = user.encryptPassword(options.password, user.salt);
                    user.tokenVerifyEmail = uuid.v4();
                    user.fullname = user.firstname + ' ' + user.lastname;

                    var promises = [
                        user.save(),
                        global.db.Collection.create({
                            name: 'Deseos',
                            description: 'Cosas que me encataria tener un dia.',
                            meta: 'product',
                            public: false
                        }),
                        global.db.Collection.create({
                            name: 'Regalos',
                            description: 'Buenas ideas para regalos.',
                            meta: 'product',
                            public: false
                        }),
                        global.db.Collection.create({
                            name: 'Obras favoritas',
                            description: 'Obras que me encantan',
                            meta: 'work',
                            public: false
                        })
                    ];
                    return global.db.Sequelize.Promise.all(promises).then(function (data) {
                      return user.addCollections(data.slice(1, data.length));
                    });
                },
                afterFind: global.afterFind
            }
        }
    );
    return User;
};
