module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Product.belongsTo(models.Work, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Product;
};
