/**
 * Load general configuration
 * ====================================================
 */
var config = require('./config');

/**
 * Load routers
 * ====================================================
 */
var pagesRouter = require(config.routesDir + '/pages');
var authRouter = require(config.routesDir + '/auth');
var dashboardRouter = require(config.routesDir + '/dashboard');
var userRouter = require(config.routesDir + '/user');
var accountRouter = require(config.routesDir + '/account');
var middlewares = require(config.middlewaresDir + '/app');
/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/dashboard', middlewares.shouldLogged, dashboardRouter);
    app.use('/account', middlewares.shouldLogged, accountRouter);

    app.use('/:username', userRouter);
};