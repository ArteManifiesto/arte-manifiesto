module.exports = function (sequelize, DataTypes) {
    var ProductCart = sequelize.define('ProductCart', {
            items: {type: DataTypes.INTEGER, defaultValue: 1},
            option: {type: DataTypes.INTEGER, defaultValue: 1}
        }, {
            classMethods: {
                associate: function (models) {
                    ProductCart.belongsTo(models.Product, {onDelete: 'cascade'});
                    ProductCart.belongsTo(models.User, {onDelete: 'cascade'});
                }
            },
            instanceMethods: {
                appendProduct: function (idProduct) {
                    this.getProduct({where: {id: idProduct}});
                }
            }
        }
    );
    return ProductCart;
};
