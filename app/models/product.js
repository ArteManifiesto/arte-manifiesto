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
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            url: {type: DataTypes.STRING},
            views: {type: DataTypes.INTEGER, defaultValue: 0}
        }, {
            classMethods: {
                associate: function (models) {
                    Product.belongsToMany(models.User, {as: 'ProductLikes', through: 'ProductLikes'});
                    Product.belongsToMany(models.User, {as: 'ProductCollects', through: 'ProductCollects'});
                    Product.belongsToMany(models.User, {as: 'ProductBuyers', through: 'ProductBuyers'});

                    Product.belongsToMany(models.Collection, {through: models.CollectionProduct});

                    Product.belongsTo(models.Work, {onDelete: 'cascade'});
                    Product.belongsTo(models.User);

                    Product.belongsTo(models.ProductType);
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
            },
            hooks: {
                afterCreate: function (product, options) {
                    product.url = '/' + options.user.username + '/work/' + product.nameSlugify;
                    return product.save();
                }
            }
        }
    );
    return Product;
};
