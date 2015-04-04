module.exports = function (sequelize, DataTypes) {
    var Collection = sequelize.define('Collection', {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Collection.belongsTo(models.User, {onDelete: 'cascade'});
                    Collection.belongsToMany(models.Work);
                }
            },
            instanceMethods: {
                isRemovable: function () {
                    return ['General', 'WishList'].indexOf(this.name) == -1;
                }
            }
        }
    );
    return Collection;
};
