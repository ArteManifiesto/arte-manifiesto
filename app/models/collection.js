var _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: DataTypes.STRING,
            //meta portfolio,work,product,store
            meta: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Collection.belongsTo(models.User, {onDelete: 'cascade'});

                    Collection.belongsToMany(models.Work, {through: models.CollectionWork});
                }
            },
            instanceMethods: {
                isMutable: function () {
                    return ['work', 'product'].indexOf(this.meta) != -1;
                },
                reorderAfterWorkAdded: function (works) {
                    var idWorks = _.pluck(works, 'id');

                    var getMaxOrderQuery = {
                        where: {WorkId: {not: idWorks}},
                        attributes: ['order'],
                        order: '`order` DESC',
                        limit: 1
                    };

                    var getWorksToReorderQuery = {
                        where: {id: {in: idWorks}},
                        attributes: ['id']
                    };

                    var promises = [
                        this.getWorks(getWorksToReorderQuery),
                        global.db.CollectionWork.findAll(getMaxOrderQuery)
                    ];

                    return global.db.Sequelize.Promise.all(promises).then(function (data) {
                        var works = data[0],
                            maxOrder = data[1].length > 0 ? data[1][0].order : 0;

                        var i, collectionWork, promises = [];
                        for (i = 0; i < works.length; i++) {
                            collectionWork = works[i].CollectionWork;
                            collectionWork.order = ++maxOrder;
                            promises.push(collectionWork.save());
                        }

                        return global.db.Sequelize.Promise.all(promises);
                    });
                },
                reorderAfterWorkRemoved: function (work) {
                    var currentOrder = this.CollectionWork.order;

                    var collectionQuery = {
                        where: {id: this.id},
                        attributes: ['id'],
                        order: [[global.db.Work, global.db.CollectionWork, 'order', 'ASC']],
                        include: [{
                            model: global.db.Work,
                            attributes: ['id'],
                            through: {where: {order: {gt: currentOrder}}}
                        }]
                    };

                    return global.db.Collection.find(collectionQuery).then(function (collection) {
                        var i, collectionWork, promises = [];
                        for (i = 0; i < collection.Works.length; i++) {
                            collectionWork = collection.Works[i].CollectionWork;
                            collectionWork.order = currentOrder;
                            ++currentOrder;
                            promises.push(collectionWork.save())
                        }

                        return global.db.Sequelize.Promise.all(promises)
                    });
                }
            },
            hooks: {
                beforeDestroy: function (collection, options, fn) {
                    collection.setWorks(null).then(function () {
                        fn(null, collection)
                    });
                }
            }
        }
    );
    return Collection;
};
