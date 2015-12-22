module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
      name: {
        type: DataTypes.STRING,
        set: function (value) {
          global.nameSlugify(this, value);
        }
      },
      nameSlugify: DataTypes.STRING,
      photo: DataTypes.STRING,
      description: DataTypes.TEXT,
      body: DataTypes.TEXT
    }, {
      classMethods: {
        associate: function (models) {
          Post.belongsTo(models.User, {onDelete: 'cascade'});
        }
      }
    }
  );
  return Post;
};
