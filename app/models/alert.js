module.exports = function(sequelize, DataTypes) {
  var Alert = sequelize.define('Alert', {
  	name: DataTypes.STRING,
    background: DataTypes.STRING,
    text: DataTypes.STRING,
    buttonText: DataTypes.STRING,
    buttonColor: DataTypes.STRING,
    buttonLink: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return Alert;
};