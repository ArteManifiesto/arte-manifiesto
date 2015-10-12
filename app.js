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

var dev = false;

global.db.sequelize.sync({force: dev}).then(function () {
    if (dev)
        return seeds.start().then(function () {
            global.lift(app);
        });
    global.lift(app);
});

exports = module.exports = app;
