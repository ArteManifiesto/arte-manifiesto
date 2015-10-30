var _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    this.setDataValue('nameSlugify', global.slugify(value));
                    this.setDataValue('name', value);
                }
            },
            nameSlugify: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Category.belongsToMany(models.User, {as: 'Specialties', through: 'Specialties'});
                    Category.belongsToMany(models.User, {as: 'Interests', through: 'Interests'});

                    Category.belongsToMany(models.Work, {through: 'WorkCategories'});
                },
                //TODO refactor intersections
                isSelected: function (user) {
                    return global.db.Sequelize.Promise.all([
                        global.db.Category.findAll(),
                        user.getSpecialties({attributes: ['id']})
                    ]).then(function (result) {
                        var categories = result[0], specialties = result[1];
                        var categoriesIds = _.pluck(categories, 'id');
                        var specialtiesIds = _.pluck(specialties, 'id');
                        var intersection = _.intersection(categoriesIds, specialtiesIds);

                        var i, item;
                        for (i = 0; i < intersection.length; i++) {
                            item = _.where(categories, {id: intersection[i]})[0];
                            item.setDataValue('selected', true);
                        }
                        return categories;
                    })
                }
            },
            hooks: {
                afterFind: function (items, options, fn) {
                    if ((items === null) ||
                        (_.isArray(items) && items.length < 1))
                        return fn(null, options);
                    if (options.isSelected) {
                        var promises = [];
                        var addPromise = function (item) {
                            if (options.isSelected)
                                promises.push(item.isSelected(options));
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
    return Category;
};
