module.exports = function(sequelize, DataTypes) {
  var Ad = sequelize.define('Ad', {
    views: DataTypes.INTEGER,
    clicks: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    description: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Ad.belongsTo(models.Brand, {
          onDelete: 'cascade'
        });

        Ad.belongsTo(models.AdPack, {
          onDelete: 'cascade'
        });
        
        Ad.belongsTo(models.AdType, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return Ad;
};