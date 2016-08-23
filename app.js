require('dotenv').load();

var express = require('express');

/**
 * Setup global basic configuration
 * ====================================================
 */
global._ = require('lodash');
global.utils = require('./config/utils');

global.cf = require('./config/config');
global.lg = require('./config/languages/es');
global.md = require('./config/middlewares');
global.db = require('./config/sequelize');

global.cl = require('cloudinary').v2;
global.cl.config(process.env.CLOUDINARY_URL);
global.cl_cors = '/cloudinary_cors.html';

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
});

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening  on http://127.0.0.1:' + app.get('port'));
});
exports = module.exports = server;
