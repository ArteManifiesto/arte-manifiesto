var crypto = require('crypto');
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            gender: DataTypes.STRING,
            photo: DataTypes.STRING,
            isArtist: DataTypes.BOOLEAN,

            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            birthday: DataTypes.DATE,
            // specialties in associations
            school: DataTypes.STRING,

            //TODO maybe need other table association for social ?
            /* facebook: DataTypes.STRING,
             twitter: DataTypes.STRING,
             instagram: DataTypes.STRING,
             tumblr: DataTypes.STRING,
             behance: DataTypes.STRING,
             web: DataTypes.STRING,*/

            // interests in associations
            hashedPassword: DataTypes.STRING,
            salt: DataTypes.STRING,
            provider: DataTypes.STRING,

            verified: {type: DataTypes.BOOLEAN, defaultValue: false},
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

                    User.belongsToMany(models.User, {as: 'UserViewers', foreignKey: 'UserViewingId', through: 'UserViewers'});
                    User.belongsToMany(models.User, {as: 'UserViewings', foreignKey: 'UserViewerId', through: 'UserViewers'});

                    User.belongsToMany(models.Work, {as: 'Likes', through: 'Likes'});
                    User.belongsToMany(models.Work, {as: 'Collects', through: 'Collects'});

                    User.belongsToMany(models.Work, {as: 'WorkViewers', through: 'WorkViewers'});
                    User.belongsToMany(models.Product, {as: 'ProductViewers', through: 'ProductViewers'});

                    User.hasMany(models.Action);
                    User.hasMany(models.Collection);

                    User.hasMany(models.UserFeatured);

                    User.hasMany(models.Work);
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
                featured: function () {
                    var scope = this;
                    return global.db.UserFeatured.create().then(function (userFeatured) {
                        return scope.addUserFeatured(userFeatured);
                    })
                },
                unFeatured: function () {
                    var query = {
                        where: {featured: true},
                        order: '`UserFeatured`.`createdAt` DESC',
                        limit: 1
                    };
                    return this.getUserFeatureds(query).then(function (userFeatureds) {
                        var userFeatured = userFeatureds[0];
                        return userFeatured.updateAttributes({featured: false});
                    });
                }
            },
            hooks: {
                afterCreate: function (user, options) {
                    options.password = options.password || '123';
                    user.provider = 'local';
                    user.salt = user.makeSalt();
                    user.hashedPassword = user.encryptPassword(options.password, user.salt);
                    user.tokenVerifyEmail = uuid.v4();

                    var query = {
                        limit: _.random(1, 4),
                        order: [sequelize.fn('RAND', '')]
                    };
                    return global.db.Category.findAll(query).then(function (categories) {
                        var promises = [
                            user.save(),
                            global.db.Collection.create({name: 'Portafolio', meta: 'portfolio'}),
                            global.db.Collection.create({name: 'Favoritos', meta: 'work'}),
                            global.db.Collection.create({name: 'Deseos', meta: 'product'}),
                            global.db.Collection.create({name: 'Regalos', meta: 'product'}),
                            //TODO only in development enviroment
                            user.setSpecialties(categories),
                            user.setInterests(categories)
                        ];

                        return global.db.Sequelize.Promise.all(promises).then(function (data) {
                            return user.addCollections(data.slice(1, data.length - 2)).then(function () {
                                var collection = data[1];

                                var ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

                                promises = [
                                    global.db.Category.findAll({
                                        where: {id: {in: _.take(ids, _.random(1, 5))}},
                                        attributes: ['id']
                                    }),
                                    global.db.Tag.findAll({
                                        where: {id: {in: _.take(ids, _.random(1, 5))}},
                                        attributes: ['id']
                                    }),
                                    global.db.Work.create({
                                        name: chance.name(),
                                        photo: 'http://i.imgur.com/QPACTzF.png',
                                        public: true
                                    })
                                ];

                                return global.db.Sequelize.Promise.all(promises).then(function (data) {
                                    var categories = data[0], tags = data[1], work = data[2];

                                    return collection.addWork(work).then(function () {
                                        promises = [
                                            collection.reorderAfterWorkAdded([work]),
                                            work.setUser(user),
                                            work.setCategories(categories),
                                            work.setTags(tags)
                                        ];
                                        return global.db.Sequelize.Promise.all(promises);
                                    })
                                });

                            });
                        });
                    });

                }
            }
        }
    );
    return User;
};
