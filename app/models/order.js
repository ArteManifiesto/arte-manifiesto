module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    status: DataTypes.STRING,
    data: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Order.belongsTo(models.User, {
          onDelete: 'cascade'
        });
        Order.belongsTo(models.User, {
          onDelete: 'cascade',
          as: 'Seller'
        });
        Order.belongsTo(models.Product, {
          onDelete: 'cascade'
        });
      }
    }
  });
  return Order;
};
