module.exports = function (sequelize, DataTypes) {
    var UserFeatured = sequelize.define('UserFeatured', {
            featured: {type: DataTypes.BOOLEAN, defaultValue: true}
        }, {
            classMethods: {
                associate: function (models) {
                    UserFeatured.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return UserFeatured;
};
