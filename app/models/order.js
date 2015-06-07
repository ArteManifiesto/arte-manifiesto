module.exports = function (sequelize, DataTypes) {
    var Order = sequelize.define('Order', {
            details: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                    
                }
            }
        }
    );
    return Order;
};
