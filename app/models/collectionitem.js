module.exports = function (sequelize, DataTypes) {
    var CollectionItem = sequelize.define('CollectionItem', {
        order: {type: DataTypes.INTEGER, defaultValue: 0},
        collection_id: {
            type: DataTypes.INTEGER,
            unique: 'item_collection_collectable'
        },
        collectable: {
            type: DataTypes.STRING,
            unique: 'item_collection_collectable'
        },
        collectable_id: {
            type: DataTypes.INTEGER,
            unique: 'item_collection_collectable',
            references: null
        }
    });
    return CollectionItem;
};
