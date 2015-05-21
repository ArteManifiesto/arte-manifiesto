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
            description: DataTypes.TEXT,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false}
        }, {
            classMethods: {
                associate: function (models) {
                    Product.belongsToMany(models.User, {as: 'ProductLikes', through: 'ProductLikes'});
                    Product.belongsToMany(models.User, {as: 'ProductViews', through: 'ProductViews'});
                    Product.belongsToMany(models.User, {as: 'ProductCollects', through: 'ProductCollects'});

                    /*Product.belongsToMany(models.Collection, {through: models.CollectionProduct});
                     */
                     Product.belongsToMany(models.Collection, {
                     through: {
                     model: models.CollectionItem,
                     unique: false,
                     scope: {
                     collectable: 'product'
                     }
                     },
                     foreignKey: 'collectable_id',
                     constraints: false
                     });

                    Product.belongsTo(models.Work, {onDelete: 'cascade'});
                    Product.belongsTo(models.User);
                    Product.belongsTo(models.ProductType);
                    Product.hasMany(models.Buyer);
                }
            },
            instanceMethods: {
                like: function (user) {
                    var scope = this;
                    return user.addProductLike(this).then(function () {
                        return global.getNumLikesOfProduct({product: scope.id});
                    });
                },
                unLike: function (user) {
                    var scope = this;
                    return user.removeProductLike(this).then(function () {
                        return global.getNumLikesOfProduct({product: scope.id});
                    });
                }
            }/*,
            hooks: {
                afterCreate: function (product, options) {
                    return global.db.ProductType.findAll({
                        order: [global.db.sequelize.fn('RAND', '')],
                        limit: 1
                    }).then(function (types) {
                        var type = types[0];
                        return type.addProduct(product);
                    });
                }
            }*/
        }
    );
    return Product;
};
