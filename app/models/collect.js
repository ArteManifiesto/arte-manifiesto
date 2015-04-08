module.exports = function (sequelize, DataTypes) {
    var Collect = sequelize.define('Collect', {}, {
            classMethods: {
                associate: function (models) {
                    Collect.belongsTo(models.User);
                    Collect.belongsTo(models.Work);
                }
            }
        }
    );
    return Collect;
};
