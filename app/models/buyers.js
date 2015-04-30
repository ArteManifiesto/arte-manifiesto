module.exports = function (sequelize, DataTypes) {
    var Buyers = sequelize.define('Buyers', {
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.INTEGER,
            direction: DataTypes.TEXT
        }, {
            classMethods: {
                associate: function (models) {
                    Buyers.belongsToMany(models.User, {as: 'Specialties', through: 'Specialties'});
                    Buyers.belongsToMany(models.User, {as: 'Interests', through: 'Interests'});

                    Buyers.belongsToMany(models.Work, {through: 'WorkCategories'});
                }
            }
        }
    );
    return Buyers;
};
