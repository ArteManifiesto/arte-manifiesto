module.exports = function(sequelize, DataTypes) {
  var Banner = sequelize.define('Banner', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING,
  });
  return Banner;
};