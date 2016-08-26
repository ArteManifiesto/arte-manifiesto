module.exports = function(sequelize, DataTypes) {
  var AdPack = sequelize.define('AdPack', {
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        AdPack.belongsTo(models.Brand, {
          onDelete: 'cascade'
        });
        
        AdPack.hasMany(models.Ad, {
          onDelete: 'cascade'
        });

        AdPack.belongsTo(models.AdPackType, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return AdPack;
};