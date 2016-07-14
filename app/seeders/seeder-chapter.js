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
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 1',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 2',
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 2',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 3',
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 3',
    releaseDate: date,
    published: true
  }, {
    name: 'Prueba 4',
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 4',
    releaseDate: date,
    published: false
  }, {
    name: 'Prueba 5',
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 5',
    releaseDate: date,
    published: false
  }, {
    name: 'Prueba 6',
    video: 'Q4VGQPk2Dl8',
    trailer: 'Q4VGQPk2Dl8',
    photo: 'http://res.cloudinary.com/arte-manifiesto/image/upload/v1467277288/x8n6nn69wsy0wo6ygrdu.jpg',
    works: '208,214',
    description: 'descripcion de prueba 6',
    releaseDate: date,
    published: false
  }]).then(function(data) {
    process.exit();
  });
});