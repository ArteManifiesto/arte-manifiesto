module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: DataTypes.STRING,
            photo: DataTypes.STRING,
            public: {type: DataTypes.BOOLEAN, defaultValue: true}
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsTo(models.User, {onDelete: 'cascade'});

                    Work.belongsToMany(models.Collection, {through: models.CollectionWork});
                    Work.belongsToMany(models.Tag);
                    Work.belongsToMany(models.Category);

                    Work.hasMany(models.Like);
                    Work.hasMany(models.Collect);

                    Work.hasMany(models.Product);
                }
            }
        }
    );
    return Work;
};
