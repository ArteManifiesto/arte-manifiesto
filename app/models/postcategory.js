module.exports = function (sequelize, DataTypes) {
    var PostCategory = sequelize.define('PostCategory', {
            name: {
                type: DataTypes.STRING,
                set: function (value) {
                    global.nameSlugify(this, value);
                }
            },
            nameSlugify: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    PostCategory.hasMany(models.Post, {onDelete: 'cascade'});
                }
            }
        }
    );
    return PostCategory;
};
