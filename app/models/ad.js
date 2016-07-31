module.exports = function(sequelize, DataTypes) {
  var Ad = sequelize.define('Ad', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    photo: DataTypes.STRING,
    price: DataTypes.STRING,
    type: DataTypes.STRING,
    size: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    views: DataTypes.INTEGER,
    clicks: DataTypes.INTEGER,
    published: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Ad.belongsTo(models.Brand, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return Ad;
};