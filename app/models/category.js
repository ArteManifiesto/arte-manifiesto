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
            nameSlugify: DataTypes.STRING,
            photo: DataTypes.STRING,
            meta: {type: DataTypes.INTEGER, defaultValue: 0},
            data: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Category.belongsToMany(models.User, {as: 'Specialties', through: 'Specialties'});
                    Category.belongsToMany(models.User, {as: 'Interests', through: 'Interests'});
                    Category.hasMany(models.Work, {onDelete: 'cascade'});
                    Category.hasMany(models.Post, {onDelete: 'cascade'});

                    Category.belongsTo(models.Category, {as :'ParentCategory'});

                    // Category.hasMany(models.Category, {onDelete:})
                }
            },
            instanceMethods: {
              appendWork: function(options) {
                var query = {limit:1, order: [global.db.sequelize.fn('RAND')]}
                var scope = this;
                return this.getWorks(query).then(function(works){
                  scope.setDataValue('work', works[0]);
                });
              }
            },
            hooks: {
              afterFind: function (items, options, fn) {
                  if ((items === null) ||
                      (_.isArray(items) && items.length < 1))
                      return fn(null, options);

                  if (options.appendWork) {
                      var promises = [];
                      var addPromise = function (item) {
                          if (options.appendWork)
                              promises.push(item.appendWork(options));
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
