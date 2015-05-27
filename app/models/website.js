module.exports = function (sequelize, DataTypes) {
    var Website = sequelize.define('Website', {
            name: DataTypes.STRING,
            url: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Website.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Website;
};
