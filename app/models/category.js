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
                }
            }
        }
    );
    return Category;
};
