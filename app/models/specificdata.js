module.exports = function (sequelize, DataTypes) {
    var SpecificData = sequelize.define('SpecificData', {
            city: DataTypes.STRING,
            country: DataTypes.STRING,
            biography: DataTypes.TEXT,
            dateOfBirth: DataTypes.DATE,
            specialties: global.setToString('specialties'),
            school: DataTypes.STRING,
            facebook: DataTypes.STRING,
            twitter: DataTypes.STRING,
            instagram: DataTypes.STRING,
            tumblr: DataTypes.STRING,
            behance: DataTypes.STRING,
            web: DataTypes.STRING,
            interests: global.setToString('interests')
        }, {
            classMethods: {
                associate: function (models) {
                    SpecificData.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return SpecificData;
};
