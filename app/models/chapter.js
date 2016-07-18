var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  var Chapter = sequelize.define('Chapter', {
    name: {
      type: DataTypes.STRING,
      set: function(value) {
        global.nameSlugify(this, value);
      }
    },
    nameSlugify: DataTypes.STRING,
    video: DataTypes.STRING,
    photo: DataTypes.STRING,
    description: DataTypes.TEXT,
    trailer: DataTypes.STRING,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    body: DataTypes.TEXT,
    releaseDate: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        Chapter.hasMany(models.Review, {
          onDelete: 'cascade'
        });
        Chapter.belongsToMany(models.Work, {
          as: 'ChapterWorks',
          through: 'ChapterWorks'
        });
        Chapter.belongsToMany(models.User, {
          as: 'UserContestsTv',
          through: 'UserContestsTv'
        });
      }
    },
    instanceMethods: {
      buildParts: function(options) {
        var scope = this;
        return scope.numOfReviews().then(function(total) {
          scope.setDataValue('reviews', total);
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
      },
      view: function() {
        this.views += 1;
        return this.save();
      }
    },
    hooks: {
      afterFind: global.afterFind
    }
  });
  return Chapter;
};