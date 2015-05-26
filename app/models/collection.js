var _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: DataTypes.STRING,
            meta: DataTypes.STRING,
            description: DataTypes.TEXT,
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
                        limit: 3
                    }
                    return this.getProducts(query).then(function (products) {
                        return products;
                    });
                }
            },
            hooks: {
                beforeDestroy: function (collection, options, fn) {
                    collection.setWorks(null).then(function () {
                        fn(null, collection)
                    });
                },
                beforeFind: function (options, fn) {
                    if (options.build)
                        options.include = [{model: global.db.User}];
                    fn(null, options);
                },
                afterFind: function (items, options, fn) {
                    if ((!options.build) || (items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);

                    if (!_.isArray(items)) {
                        return items.buildParts(options).then(function () {
                            return fn(null, options);
                        });
                    }

                    var i, promises = [];
                    for (i = 0; i < items.length; i++)
                        promises.push(items[i].buildParts(options));
                    return global.db.Sequelize.Promise.all(promises).then(function () {
                        return fn(null, options);
                    });
                }
            }
        }
    );
    return Collection;
};
