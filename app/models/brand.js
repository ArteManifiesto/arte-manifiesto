module.exports = function(sequelize, DataTypes) {
  var Brand = sequelize.define('Brand', {
    name: {
      type: DataTypes.STRING,
      set: function(value) {
        global.nameSlugify(this, value);
      }
    },
    nameSlugify: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        Brand.hasMany(models.Ad, {
          onDelete: 'cascade'
        });

        Brand.hasMany(models.AdPack, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return Brand;
};