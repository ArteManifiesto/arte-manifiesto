module.exports = function(sequelize, DataTypes) {
  var AdPackType = sequelize.define('AdPackType', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        AdPackType.hasMany(models.AdPack, {
          onDelete: 'cascade'
        });
        
        AdPackType.belongsToMany(models.AdType, {
          as: 'Types',
          through: 'AdPackTypeAdTypes'
        });
      }
    }
  });
  return AdPackType;
};