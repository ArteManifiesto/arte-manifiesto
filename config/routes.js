var express = require('express');

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
var adminRouter = require(config.routesDir + '/admin');
var checkoutRouter = require(config.routesDir + '/checkout');
var userRouter = require(config.routesDir + '/user');
var middlewares = require(config.middlewaresDir + '/app');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/checkout', middlewares.isLogged, checkoutRouter);
    app.use('/:username', userRouter);
};