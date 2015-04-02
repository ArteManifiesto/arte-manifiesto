module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Collection.hasMany(models.Work);
                    Collection.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Collection;
};
