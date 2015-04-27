var _ = require('lodash');

var Chance = require('chance');
var chance = new Chance();

module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING,
            description: DataTypes.TEXT,
            photo: DataTypes.STRING,
            public: {type: DataTypes.BOOLEAN, defaultValue: true}
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsTo(models.User, {onDelete: 'cascade'});

                    Work.belongsToMany(models.Collection, {through: models.CollectionWork});
                    Work.belongsToMany(models.Tag, {through: 'WorkTags'});
                    Work.belongsToMany(models.Category, {through: 'WorkCategories'});

                    Work.belongsToMany(models.User, {as: 'Likes', through: 'Likes'});
                    Work.belongsToMany(models.User, {as: 'Collects', through: 'Collects'});
                    Work.belongsToMany(models.User, {as: 'WorkViewers', through: 'WorkViewers'});

                    Work.hasMany(models.WorkFeatured);

                    Work.hasMany(models.Product);
                }
            },
            instanceMethods: {
                featured: function () {
                    var scope = this;
                    return global.db.WorkFeatured.create().then(function (workFeatured) {
                        return scope.addWorkFeatured(workFeatured);
                    })
                },
                unFeatured: function () {
                    var query = {
                        where: {featured: true},
                        order: '`WorkFeatured`.`createdAt` DESC',
                        limit: 1
                    };
                    return this.getWorkFeatureds(query).then(function (workFeatureds) {
                        var workFeatured = workFeatureds[0];
                        return workFeatured.updateAttributes({featured: false});
                    });
                }
            },
            hooks: {
                afterCreate: function (work, options) {
                    var promises = [];
                    for (var i = 0; i < 2; i++) {

                        promises.push(global.db.Product.create({
                            name: chance.name(),
                            price: _.random(0, 1000),
                            UserId: options.user,
                            photo: '/img/products/product' + (_.random(1, 20).toString()) + '.jpg',
                            description: chance.paragraph({sentences: 2})
                        }))
                    }
                    return global.db.Sequelize.Promise.all(promises).then(function (products) {
                        return work.addProducts(products);
                    })
                }
            }
        }
    );
    return Work;
};
