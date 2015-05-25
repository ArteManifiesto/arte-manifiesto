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
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0}
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
                    var scope = this, promises = [
                        this.addProductLike(user), this.increment({popularity: 3})
                    ];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return scope.likes();
                    });
                },
                unLike: function (user) {
                    var scope = this, promises = [
                        this.removeProductLike(user), this.decrement({popularity: 3})
                    ];
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return scope.likes();
                    });
                },
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.likes(),
                        scope.liked(options.viewer),
                        scope.friends(options.user)
                    ]).then(function (result) {
                        scope.setDataValue('likes', result[0]);
                        scope.setDataValue('liked', result[1]);
                        scope.setDataValue('friends', result[2]);
                    });
                },
                likes: function () {
                    var scope = this,
                        query = {
                            attributes: [
                                [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'likes']
                            ]
                        }
                    return this.getProductLikes(query).then(function (result) {
                        return result[0].getDataValue('likes');
                    });
                },
                liked: function (viewer) {
                    var scope = this, query = {where: {id: viewer}};
                    return this.getProductLikes(query).then(function (likes) {
                        return likes.length > 0;
                    });
                },
                friends: function (user) {
                    if (user === undefined)
                        return [];

                    var scope = this, queryProductLikes = {attributes: ['id']};
                    return this.getProductLikes(queryProductLikes).then(function (productLikes) {
                        var queryFollowings = {attributes: ['id', 'username', 'photo', 'url']};
                        return user.getFollowings(queryFollowings).then(function (followings) {
                            var productLikesId = _.pluck(productLikes, 'id');
                            var followingsId = _.pluck(followings, 'id');
                            var intersection = _.intersection(productLikesId, followingsId);
                            var result = [];
                            for (var i = 0; i < intersection.length; i++)
                                result.push(_.where(followings, {id: intersection[i]})[0]);
                            return result;
                        });
                    });
                },
                userLikes: function () {
                    var query = {attributes: ['id', 'username', 'photo', 'url'], limit: 50};
                    return this.getProductLikes(query);
                },
                similar: function (options) {
                    var query = {
                        where: {ProductTypeId: this.ProductTypeId, id: {$not: [this.id]}},
                        order: [global.db.sequelize.fn('RAND')],
                        limit: 10, build: true
                    };
                    return global.db.Product.findAll(query);
                },
                more: function () {
                    var query = {
                        where: {id: {$not: [this.id]}},
                        order: [global.db.sequelize.fn('RAND')],
                        limit: 6, build: true
                    };
                    return this.User.getProducts(query);
                }
            },
            hooks: {
                afterCreate: function (product, options) {
                    product.url = options.user.url + '/product/' + product.nameSlugify;
                    return product.save();
                },
                beforeFind: function (options, fn) {
                    options.include = [{
                        model: global.db.User,
                        attributes: ['id', 'username', 'firstname', 'lastname', 'photo', 'url']
                    }, {
                        model: global.db.Work,
                        attributes: ['id', 'name', 'photo', 'url']
                    }];
                    fn(null, options);
                },
                afterFind: function (products, options, fn) {
                    if (!options.build)
                        return fn(null, options);

                    if (!_.isArray(products)) {
                        return products.buildParts(options).then(function () {
                            return fn(null, options);
                        });
                    }

                    var i, product, promises = [];
                    for (i = 0; i < products.length; i++)
                        promises.push(products[i].buildParts(options));
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return fn(null, options);
                    });
                }
            }
        }
    );
    return Product;
};
