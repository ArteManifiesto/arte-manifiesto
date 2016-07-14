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
    hasContest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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
      view: function() {
        this.views += 1;
        return this.save();
      }
    }
  });
  return Chapter;
};