module.exports = function(sequelize, DataTypes) {
  var AdType = sequelize.define('AdType', {
    name: DataTypes.STRING,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        AdType.hasMany(models.Ad, {
          onDelete: 'cascade'
        });

        AdType.belongsToMany(models.AdPackType, {
          as: 'Types',
          through: 'AdPackTypeAdTypes'
        });
      }
    }
  });
  return AdType;
};