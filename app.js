process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Load dependencies
 * ====================================================
 */
var express = require('express');
var utils = require('./config/utils');
var config = require('./config/config');
var db = require('./config/sequelize');
var passport = require('./config/passport');

/**
 * Start APP
 * ====================================================
 */
var app = express();

/**
 * Initialize expres configuration
 * ====================================================
 */
require('./config/express')(app, passport);

/**
 * Run matches routes with controllers
 * ====================================================
 */
require('./config/routes').init(app);

/**
 * Run handlers errors
 * ====================================================
 */
require('./config/errors')(app);

/**
 * Run database and get up server
 * ====================================================
 */
app.set('port', process.env.PORT || config.port);

global.db = db;
var dev = !(process.env.NODE_ENV == 'production');
global.db.sequelize.sync({force: dev}).then(function () {
    if (dev) {

    }
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port', server.address().port);
    });
});

exports = module.exports = app;