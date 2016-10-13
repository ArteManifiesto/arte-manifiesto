module.exports = function(sequelize, DataTypes) {
  var Subscriber = sequelize.define('Subscriber', {
    email: DataTypes.STRING
  });
  return Subscriber;
};