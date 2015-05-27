module.exports = function (sequelize, DataTypes) {
    var Address = sequelize.define('Address', {
            country: DataTypes.STRING,
            fullname: DataTypes.STRING,
            addressOne: DataTypes.STRING,
            addressTwo: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            zipCode: DataTypes.STRING,
            phone: DataTypes.STRING
        }, {
            classMethods: {
                associate: function (models) {
                    Address.belongsTo(models.User, {onDelete: 'cascade'});
                }
            }
        }
    );
    return Address;
};
