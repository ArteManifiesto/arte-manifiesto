require('dotenv').load();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');

/**
 * Setup global basic configuration
 * ====================================================
 */
global.cf = require('./config/config');
global.md = require('./config/middlewares');
global.db = require('./config/sequelize');
global.utils = require('./config/utils');

/**
 * Setup utilities
 * ====================================================
 */
var seeds = require('./config/seeds');
var _ = require('lodash');

/**
 * Setup server configuration and sessions
 * ====================================================
 */
var passport = require('./config/passport');
var app = express();

require('json-response');
require('./config/express')(app, passport);
require('./config/routes').init(app);
require('./config/errors')(app);

app.set('port', process.env.PORT || cf.port);

global.db.sequelize.sync({force: false}).then(function () {
  global.lift(app);
  // global.db.User.findAll().then(function(users){
  //   var promises = [];
  //   for(var i=0; i<users.length;i++){
  //     promises.push(global.db.Collection.create({
  //         name: 'Obras favoritas',
  //         description: 'Obras que me encantan',
  //         meta: 'work',
  //         UserId: users[i].id
  //     }));
  //   }
  //   return global.db.Sequelize.Promise.all(promises).then(function (data) {
  //     console.log('collections created');
  //   });
  // });
});

exports = module.exports = app;
