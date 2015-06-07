module.exports = function (sequelize, DataTypes) {
    var CollectionProduct = sequelize.define('CollectionProduct', {
            order: {type: DataTypes.INTEGER, defaultValue: 0}
        }
    );
    return CollectionProduct;
};
