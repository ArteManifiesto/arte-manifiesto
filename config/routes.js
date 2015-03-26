/**
 * Load general configuration
 * ====================================================
 */
var config = require('./config');

/**
 * Load routers
 * ====================================================
 */
var staticRouter = require(config.routesDir + '/static');
var authRouter = require(config.routesDir + '/auth');
var dashboardRouter = require(config.routesDir + '/dashboard');
var userRouter = require(config.routesDir + '/user');

var middlewares = require(config.middlewaresDir + '/app');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', staticRouter);
    app.use('/auth', authRouter);
    app.use('/dashboard', dashboardRouter);
    app.use('/user', userRouter);
};