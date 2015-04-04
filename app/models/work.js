module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: DataTypes.STRING,
            photo: DataTypes.STRING,
            private: {type: DataTypes.BOOLEAN, defaultValue: false},
            order: {type: DataTypes.INTEGER, defaultValue: 0}
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsToMany(models.Collection);

                    Work.belongsToMany(models.Tag);
                    Work.belongsToMany(models.Category);

                    Work.belongsToMany(models.User, {as: 'Views', through: 'Views', onDelete: 'cascade'});
                    Work.belongsToMany(models.User, {as: 'Likes', through: 'Likes', onDelete: 'cascade'});
                    Work.belongsToMany(models.User, {as: 'Collects', through: 'Collects', onDelete: 'cascade'});

                    Work.hasMany(models.Product);
                }
            }
        }
    );
    return Work;
};
