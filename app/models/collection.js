var _ = require('lodash');
var moment =  require('moment');

module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                  this.setDataValue('nameSlugify', global.slugify(value + '-' + moment().format('DDMMYYhhmmss')));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            description: DataTypes.TEXT,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false}
        }, {
            classMethods: {
                associate: function (models) {
                    Collection.belongsToMany(models.Work, {through: 'CollectionWork'});
                    Collection.belongsTo(models.User, {onDelete: 'cascade'});
                }
            },
            instanceMethods: {
                buildParts: function (options) {
                    var scope = this;
                    return global.db.Sequelize.Promise.all([
                        scope.numOfWorks(),
                        scope.works()
                    ]).then(function (result) {
                        scope.setDataValue('numOfWorks', result[0]);
                        scope.setDataValue('works', result[1]);
                    });
                },
                numOfWorks: function () {
                    var scope = this, query = {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
                        ]
                    }
                    return this.getWorks(query).then(function (result) {
                        return result[0].getDataValue('total');
                    });
                },
                works: function () {
                    var scope = this, query = {
                        include: [{model: global.db.User}],
                        limit: 3
                    }
                    return this.getWorks(query);
                },
                workInside: function (options) {
                    var scope = this, query = {
                        attributes: [
                            [global.db.sequelize.fn('COUNT', global.db.sequelize.col('id')), 'total']
                        ], where: {id: options.idProduct}
                    }
                    return this.getWorks(query).then(function (result) {
                        var isInside = result[0].getDataValue('total') > 0
                        if (options.raw)
                            return isInside;
                        return scope.setDataValue('workInside', isInside);
                    });
                }
            },
            hooks: {
                beforeDestroy: function (collection, options, fn) {
                    collection.setWorks(null).then(function () {
                        fn(null, collection);
                    });
                },
                beforeFind: function (options, fn) {
                    if (options.build)
                        options.include = [{model: global.db.User}];
                    fn(null, options);
                },
                afterFind: function (items, options, fn) {
                    if ((items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);
                    if (options.build || options.workInside) {
                        var promises = [];
                        var addPromise = function (item) {
                            if (options.build)
                                promises.push(item.buildParts(options));

                            if (options.workInside)
                                promises.push(item.workInside(options));
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
