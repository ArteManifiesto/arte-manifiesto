module.exports = function (sequelize, DataTypes) {
    var Like = sequelize.define('Like', {}, {
            classMethods: {
                associate: function (models) {
                    Like.belongsTo(models.User);
                    Like.belongsTo(models.Work);
                }
            }
        }
    );
    return Like;
};
