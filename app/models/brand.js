module.exports = function(sequelize, DataTypes) {
  var Brand = sequelize.define('Brand', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Brand.hasMany(models.Ad, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return Brand;
};