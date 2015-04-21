module.exports = function (sequelize, DataTypes) {
    var WorkFeatured = sequelize.define('WorkFeatured', {
            featured: {type: DataTypes.BOOLEAN, defaultValue: true}
        }, {
            classMethods: {
                associate: function (models) {
                    WorkFeatured.belongsTo(models.Work, {onDelete: 'cascade'});
                }
            }
        }
    );
    return WorkFeatured;
};
