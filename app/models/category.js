module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('Category', {
            name: DataTypes.STRING
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
