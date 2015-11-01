module.exports = function (sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
            name: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    //TODO maybe tag need delete when the work is deleted?
                    Tag.belongsToMany(models.Work , {through: 'WorkTags'});
                }
            }
        }
    );
    return Tag;
};
