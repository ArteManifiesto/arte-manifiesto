module.exports = function (sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Tag.belongsToMany(models.Product, {through: 'ProductTags'});
                    Tag.belongsToMany(models.Work , {through: 'WorkTags'});
                }
            }
        }
    );
    return Tag;
};
