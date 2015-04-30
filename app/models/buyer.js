module.exports = function (sequelize, DataTypes) {
    var Buyer = sequelize.define('Buyer', {
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.INTEGER,
            direction: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                    Buyer.belongsTo(models.Product);
                }
            }
        }
    );
    return Buyer;
};
