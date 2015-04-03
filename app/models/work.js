module.exports = function (sequelize, DataTypes) {
    var Work = sequelize.define('Work', {
            name: DataTypes.STRING,
            photo: DataTypes.STRING,
            private: {type: DataTypes.BOOLEAN, defaultValue: false},
            order: {type: DataTypes.INTEGER, defaultValue: 0}
        }, {
            classMethods: {
                associate: function (models) {
                    Work.belongsTo(models.Collection, {onDelete: 'cascade'});
                    Work.hasMany(models.Product);
                    Work.belongsToMany(models.Tag);
                    Work.belongsToMany(models.Category);
                }
            }
        }
    );
    return Work;
};
