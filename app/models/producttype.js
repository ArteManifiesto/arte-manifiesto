module.exports = function (sequelize, DataTypes) {
    var ProductType = sequelize.define('ProductType', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            profit: DataTypes.INTEGER
        }, {
            classMethods: {
                associate: function (models) {
                    ProductType.hasMany(models.Product);
                }
            }
        }
    );
    return ProductType;
};
