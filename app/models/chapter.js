module.exports = function(sequelize, DataTypes) {
  var Chapter = sequelize.define('Chapter', {
  	video: DataTypes.STRING,
  	titulo: DataTypes.STRING,
  	descripcion: DataTypes.STRING
  });
  return Chapter;
};