var _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            meta: DataTypes.STRING,
            description: DataTypes.TEXT,
            baseDescription: DataTypes.TEXT,
            needGenerate: {type: DataTypes.BOOLEAN, defaultValue: true},
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            url: {type: DataTypes.STRING}
        }, {
            classMethods: {
                associate: function (models) {
                    Collection.belongsToMany(models.Product, {through: models.CollectionProduct});
                    Collection.belongsTo(models.User, {onDelete: 'cascade'});
                }
            },
            instanceMethods: {
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.numOfProducts(),
                        scope.products()
                    ]).then(function (result) {
                        scope.setDataValue('numOfProducts', result[0]);
                        scope.setDataValue('products', result[1]);
                    });
                },
                numOfProducts: function () {
                    var scope = this, query = {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
                        ]
                    }
                    return this.getProducts(query).then(function (result) {
                        return result[0].getDataValue('total');
                    });
                },
                products: function () {
                    var scope = this, query = {
                        include: [{model: global.db.User}],
                        limit: 3, order: [{raw: '`CollectionProduct`.`order` ASC'}]
                    }
                    return this.getProducts(query).then(function (products) {
                        return products;
                    });
                },
                productInside: function (options) {
                    var scope = this, query = {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
                        ], where: {id: options.idProduct}
                    }
                    return this.getProducts(query).then(function (result) {
                        var isInside = result[0].getDataValue('total') > 0
                        if (options.raw)
                            return isInside;
                        return scope.setDataValue('productInside', isInside);
                    });
                },
                generateDescription: function () {
                    var scope = this, query = {
                        group: [[global.db.User, 'username']],
                        addUser: true,
                        limit: 4
                    };
                    return scope.getProducts(query).then(function (products) {
                        var i, product;
                        if (products.length > 0) {
                            scope.description = scope.baseDescription + 'usando productos de ';
                            var usernames = []
                            for (i = 0; i < products.length; i++)
                                usernames.push(products[i].User.username);

                            if (usernames.length > 1)
                                scope.description += usernames.slice(0, usernames.length - 1).join(', ') + ' y '

                            scope.description += usernames[usernames.length - 1] + '.';
                        } else {
                            scope.description = scope.baseDescription;
                        }
                        return scope.save();
                    })
                },
                appendProduct: function (options) {
                    var scope = this, query = {where: {id: options.idProduct}};
                    return global.db.Product.find(query).then(function (product) {
                        return scope.addProduct(product).then(function () {
                            if (scope.needGenerate)
                                return scope.generateDescription();
                        });
                    });
                },
                deleteProduct: function (options) {
                    console.log('delete products ctmre');
                    var scope = this, query = {where: {id: options.idProduct}};
                    return global.db.Product.find(query).then(function (product) {
                        return scope.removeProduct(product).then(function () {
                            console.log('removed pe ', scope.needGenerate);
                            if (scope.needGenerate)
                                return scope.generateDescription();
                        });
                    });
                }
            },
            hooks: {
                afterCreate: function (collection, options) {
                    collection.url = options.user.url + '/collection/' + collection.nameSlugify;
                    if (collection.needGenerate) {
                        collection.baseDescription = collection.description =
                            'Coleccion creada por ' + options.user.fullname;
                    }

                    return collection.save();
                },
                beforeDestroy: function (collection, options, fn) {
                    collection.setWorks(null).then(function () {
                        fn(null, collection)
                    });
                },
                beforeFind: function (options, fn) {
                    if (options.build)
                        options.include = [{model: global.db.User}];
                    options.where = options.where || {}
                    if (options.store)
                        options.where.meta = 'store';
                    else
                        options.where.meta = 'products';
                    fn(null, options);
                },
                afterFind: function (items, options, fn) {
                    if ((items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);
                    if (options.build || options.productInside || options.appendProduct) {
                        var promises = [];
                        var addPromise = function (item) {
                            if (options.build)
                                promises.push(item.buildParts(options));

                            if (options.productInside)
                                promises.push(item.productInside(options));

                            if (options.appendProduct)
                                promises.push(item.appendProduct(options));
                        };

                        if (!_.isArray(items))
                            addPromise(items);

                        for (var i = 0; i < items.length; i++)
                            addPromise(items[i]);

                        return global.db.Sequelize.Promise.all(promises).then(function () {
                            return fn(null, options);
                        });
                    }
                    return fn(null, options);
                }
            }
        }
    );
    return Collection;
};