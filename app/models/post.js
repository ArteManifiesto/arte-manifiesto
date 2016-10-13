module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    name: {
      type: DataTypes.STRING,
      set: function(value) {
        global.nameSlugify(this, value);
      }
    },
    nameSlugify: DataTypes.STRING,
    photo: DataTypes.STRING,
    description: DataTypes.TEXT,
    body: DataTypes.TEXT,
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    popularity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.User, {
          onDelete: 'cascade'
        });
        Post.belongsTo(models.Category);
        Post.hasMany(models.Review, {
          onDelete: 'cascade'
        });
        Post.belongsToMany(models.User, {
          as: 'PostLikes',
          through: 'PostLikes'
        });
      }
    },
    instanceMethods: {
      buildParts: function(options) {
        var scope = this;
        return global.db.Sequelize.Promise.all([
          scope.numOfLikes(),
          scope.numOfReviews(),
          scope.liked(options.viewer)
        ]).then(function(result) {
          scope.setDataValue('likes', result[0]);
          scope.setDataValue('reviews', result[1]);
          scope.setDataValue('liked', result[2]);
        });
      },
      liked: function(viewer) {
        var scope = this,
          query = {
            where: {
              id: viewer
            }
          };
        return this.getPostLikes(query).then(function(likes) {
          return likes.length > 0;
        });
      },
      view: function() {
        this.views += 1;
        this.popularity += 1;
        return this.save();
      },
      like: function(user) {
        var scope = this;
        return user.addPostLike(this).then(function() {
          return scope.numOfLikes().then(function(likes) {
            scope.popularity = scope.views + (likes * 50);
            return scope.save().then(function() {
              return likes;
            });
          });
        });
      },
      numOfLikes: function() {
        var scope = this,
          query = {
            attributes: [
              [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
            ]
          };
        return this.getPostLikes(query).then(function(result) {
          return result[0].getDataValue('total');
        });
      },
      numOfReviews: function() {
        var scope = this,
          query = {
            attributes: [
              [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
            ]
          };
        return this.getReviews(query).then(function(result) {
          return result[0].getDataValue('total');
        });
      }
    },
    hooks: {
      beforeFind: global.beforeFind,
      afterFind: global.afterFind
    }
  });
  return Post;
};