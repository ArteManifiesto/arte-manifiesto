module.exports = function (sequelize, DataTypes) {
    var Review = sequelize.define('Review', {
            value: DataTypes.TEXT,
        }, {
            classMethods: {
                associate: function (models) {
                  Review.belongsTo(models.Work);
                  Review.belongsTo(models.User);
                }
            }
        }
    );
    return Review;
};
