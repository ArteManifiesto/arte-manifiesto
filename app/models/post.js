module.exports = function (sequelize, DataTypes) {
    var Post = sequelize.define('Post', {
            name: {
                type: DataTypes.STRING,
                set: function(value) {
                  global.nameSlugify(this, value);
                }
            },
            nameSlugify: DataTypes.STRING,
            photo: DataTypes.STRING,
            public: {type: DataTypes.BOOLEAN, defaultValue: true},
            featured: {type: DataTypes.BOOLEAN, defaultValue: false},
            body: DataTypes.TEXT,
            views: {type: DataTypes.INTEGER, defaultValue: 0},
            popularity: {type: DataTypes.INTEGER, defaultValue: 0},
        }, {
            classMethods: {
                associate: function (models) {
                  Post.belongsToMany(models.Tag, {through: 'PostTags'});
                  Post.belongsTo(models.User);
                  Post.belongsTo(models.PostCategory);
                }
            },
            hooks: {
              beforeFind: global.beforeFind,
              afterFind: global.afterFind
            }
        }
    );
    return Post;
};
