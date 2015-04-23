var _ = require('lodash');

var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            price: DataTypes.INTEGER,
            photo: DataTypes.STRING,
            description: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                    Product.belongsToMany(models.User, {as: 'ProductViewers', through: 'ProductViewers'});
                    Product.belongsTo(models.Work, {onDelete: 'cascade'});
                    Product.belongsTo(models.ProductType);

                    Product.hasMany(models.ProductFeatured);


                }
            },
            hooks: {
                afterCreate: function (product, options) {
                    return global.db.ProductType.find(_.random(1, 5)).then(function (type) {
                        return type.addProduct(product);
                    });
                }
            }
        }
    );
    return Product;
};
