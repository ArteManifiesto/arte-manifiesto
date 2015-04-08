module.exports = function (sequelize, DataTypes) {
    var CollectionWork = sequelize.define('CollectionWork', {
            order: {type: DataTypes.INTEGER, defaultValue: 0}
        }
    );
    return CollectionWork;
};
