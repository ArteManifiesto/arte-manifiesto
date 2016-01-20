module.exports = function (sequelize, DataTypes) {
    var Review = sequelize.define('Review', {
            value: DataTypes.TEXT,
        }, {
            classMethods: {
                associate: function (models) {
                  Review.belongsTo(models.Work, {onDelete: 'cascade'});
                  Review.belongsTo(models.Post, {onDelete: 'cascade'});
                  Review.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Review;
};
