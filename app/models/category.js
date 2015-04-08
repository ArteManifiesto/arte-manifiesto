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
                    Category.belongsToMany(models.User, {as: 'Users', through: 'Specialties', onDelete: 'destroy'});
                    Category.belongsToMany(models.User, {as: 'Users', through: 'Interests', onDelete: 'destroy'});
                    Category.belongsToMany(models.Work);
                }
            }
        }
    );
    return Category;
};
