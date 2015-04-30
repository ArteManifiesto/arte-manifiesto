module.exports = function (sequelize, DataTypes) {
    var OrderStatus = sequelize.define('OrderStatus', {
            code: DataTypes.INTEGER,
            description: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    
                }
            }
        }
    );
    return OrderStatus;
};
