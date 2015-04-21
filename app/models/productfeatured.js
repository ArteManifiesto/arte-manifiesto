module.exports = function (sequelize, DataTypes) {
    var ProductFeatured = sequelize.define('ProductFeatured', {
            featured: {type: DataTypes.BOOLEAN, defaultValue: true}
        }, {
            classMethods: {
                associate: function (models) {
                    ProductFeatured.belongsTo(models.Product, {onDelete: 'cascade'});
                }
            }
        }
    );
    return ProductFeatured;
};
