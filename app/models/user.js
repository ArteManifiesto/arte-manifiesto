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
      pseudonimo: DataTypes.STRING,
      gender: DataTypes.STRING,
      photo: DataTypes.STRING,
      cover: DataTypes.STRING,
      isArtist: {type: DataTypes.BOOLEAN, defaultValue: false},

      city: DataTypes.STRING,
      country: DataTypes.STRING,
      biography: DataTypes.TEXT,
      birthday: {
        type: DataTypes.DATE,
        set: function (value) {
          var birthday = moment(value, 'DD/MM/YYYY');
          this.setDataValue('birthday', birthday.toDate());
        }
      },

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

      typeName: {type: DataTypes.INTEGER, defaultValue: 1},
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

          User.belongsToMany(models.Post, {as: 'PostLikes', through: 'PostLikes'});

          User.hasMany(models.Post);
          User.hasMany(models.Collection);
          User.hasMany(models.Work, {onDelete: 'cascade'});
          User.hasMany(models.Review, {onDelete: 'cascade'});
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
        view: function () {
          this.views += 1;
          this.popularity += 1;
          return this.save();
        },
        follow: function (user) {
          var scope = this;
          return user.addFollower(this).then(function () {
            return user.numOfFollowers().then(function (followers) {
              user.popularity = user.views + (followers * 50);
              return user.save().then(function () {
                return followers;
              });
            });
          });
        },
        unFollow: function (user) {
          var scope = this;
          return user.removeFollower(this).then(function () {
            return user.numOfFollowers().then(function (followers) {
              user.popularity = user.views + (followers * 50);
              return user.save().then(function () {
                return followers;
              });
            });
          });
        },
        buildParts: function (options) {
          var scope = this, worksQuery = {
            attributes: ['id', 'name', 'nameSlugify', 'photo', 'nsfw'],
            where: {public: true},
            limit: 4,
            order: [global.getOrder('popularity')]
          };
          return global.db.Sequelize.Promise.all([
            scope.numOfFollowers(),
            scope.numOfWorks(),
            scope.following(options.viewer),
            scope.friends(options.viewer),
            scope.getWorks(worksQuery)
          ]).then(function (result) {
            scope.setDataValue('numOfFollowers', result[0]);
            scope.setDataValue('numOfWorks', result[1]);
            scope.setDataValue('following', result[2]);
            scope.setDataValue('friends', result[3]);
            scope.setDataValue('Works', result[4]);
          });
        },
        calculateValoration: function () {
          return this.getWorks().then(function (works) {
            var promises = [];
            for (var i = 0; i < works.length - 1; i++)
              promises.push(works[i].numOfLikes());

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
          options = options || {};
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
        },
        friends: function (viewer) {
          if (viewer < 0)
            return [];

          var scope = this, queryLikes = {attributes: ['id']},
            queryFollowings = {attributes: ['id', 'username', 'fullname', 'photo']};

          var promises = [
            this.getFollowers(queryLikes),
            global.db.User.findById(viewer).then(function (user) {
              return user.getFollowings(queryFollowings);
            })
          ]
          return global.db.Sequelize.Promise.all(promises).then(function (result) {
            var likes = result[0], followings = result[1];

            var likesId = global._.pluck(likes, 'id');
            var followingsId = global._.pluck(followings, 'id');
            var intersection = global._.intersection(likesId, followingsId);
            var i, friends = [];
            for (i = 0; i < intersection.length; i++)
              friends.push(global._.where(followings, {id: intersection[i]})[0]);

            return friends;
          });
        }
      },
      hooks: {
        afterCreate: function (user, options) {
          options.password = options.password || '123';
          user.username = 'am' + moment().format('DDMMYYhhmmss') + user.id;
          if(!user.photo)
            user.photo = 'http://res.cloudinary.com/arte-manifiesto/image/upload/w_150,h_150,q_70/am_avatar.jpg';
          user.cover = 'http://res.cloudinary.com/arte-manifiesto/image/upload/c_limit,w_1600/general/am-cover.jpg';
          user.salt = user.makeSalt();
          user.hashedPassword = user.encryptPassword(options.password, user.salt);
          user.tokenVerifyEmail = uuid.v4();
          user.fullname = user.firstname + ' ' + user.lastname;

          var query = {where:{username: 'artemanifiesto'}};
          return global.db.User.find(query).then(function(am) {
            var promises = [
              user.save(),
              user.follow(am),
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
              return user.addCollections(data.slice(2, data.length));
            });
          });
        },
        afterFind: global.afterFind
      }
    }
  );
  return User;
};
