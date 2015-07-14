module.exports = function (sequelize, DataTypes) {
    var Order = sequelize.define('Order', {
            status: DataTypes.INTEGER,
            arrive: DataTypes.DATE
        }, {
            classMethods: {
                associate: function (models) {
                    Order.belongsTo(models.User);
                    Order.hasOne(models.Address);
                    Order.hasOne(models.ProductCart);
                }
            }
        }
    );
    return Order;
};
