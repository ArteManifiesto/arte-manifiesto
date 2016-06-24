module.exports = function(sequelize, DataTypes) {
  var Chapter = sequelize.define('Chapter', {
  	video: DataTypes.STRING
  });
  return Chapter;
};