module.exports = function (sequelize, DataTypes) {
    var Action = sequelize.define('Action', {
            meta: DataTypes.INTEGER
        }, {
            classMethods: {
                associate: function (models) {
                    Action.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Action;
};
