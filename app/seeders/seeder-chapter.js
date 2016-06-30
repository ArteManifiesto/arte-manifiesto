require('dotenv').load();
global.utils = require('../../config/utils');
global.cf = require('../../config/config');
var db = require('../../config/sequelize');
var moment = require('moment');
var date = moment('04/12/1992', 'DD/MM/YYYY').toDate();
db.sequelize.sync({
  force: false
}).then(function() {
  db.Chapter.bulkCreate([{
    name: 'Prueba 1',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 1',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 2',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 2',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 3',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 3',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 4',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 4',
    releaseDate: date,
    published: false
  }, {
    name: 'Prueba 5',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 5',
    releaseDate: date,
    published: false
  }, {
    name: 'Prueba 6',
    video: 'https://vimeo.com/168111128',
    description: 'descripcion de prueba 6',
    releaseDate: date,
    published: false
  }]).then(function(data) {
    console.log(data);
    process.exit();
  });
});