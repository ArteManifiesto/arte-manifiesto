module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
      name: {
        type: DataTypes.STRING,
        set: function (value) {
          global.nameSlugify(this, value);
        }
      },
      nameSlugify: DataTypes.STRING,
      photo: DataTypes.STRING,
      description: DataTypes.TEXT,
      body: DataTypes.TEXT,
      published: {type: DataTypes.BOOLEAN, defaultValue: false},
      featured: {type: DataTypes.BOOLEAN, defaultValue: false},
      views: {type: DataTypes.INTEGER, defaultValue: 0},
      popularity: {type: DataTypes.INTEGER, defaultValue: 0}
    }, {
      classMethods: {
        associate: function (models) {
          Post.belongsTo(models.User, {onDelete: 'cascade'});
          Post.belongsTo(models.Category);
          Post.belongsToMany(models.User, {as: 'PostLikes', through: 'PostLikes'});
        }
      },
      instanceMethods: {
        buildParts: function (options) {
          var scope = this;
          return global.db.Sequelize.Promise.all([
            scope.numOfLikes()
            // scope.numOfComments()
          ]).then(function (result) {
            scope.setDataValue('likes', result[0]);
          });
        },
        numOfLikes: function () {
          var scope = this,
            query = {
              attributes: [
                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
              ]
            };
          return this.getPostLikes(query).then(function (result) {
            return result[0].getDataValue('total');
          });
        }
        // ,
        // numOfComments: function () {
        //   var scope = this,
        //     query = {
        //       attributes: [
        //         [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
        //       ]
        //     };
        //   return this.getReviews(query).then(function (result) {
        //     return result[0].getDataValue('total');
        //   });
        // }
      },
      hooks: {
        beforeFind: global.beforeFind,
        afterFind: global.afterFind
      }
    }
  );
  return Post;
};
