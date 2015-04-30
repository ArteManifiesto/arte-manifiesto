module.exports = function (sequelize, DataTypes) {
    var PaymentMethod = sequelize.define('PaymentMethod', {
            code: DataTypes.INTEGER,
            description: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {

                }
            }
        }
    );
    return PaymentMethod;
};
