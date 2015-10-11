var express = require('express');

/**
 * Load routers
 * ====================================================
 */

var pagesRouter = require(global.cf.routes + '/pages');
var authRouter = require(global.cf.routes + '/auth');
var adminRouter = require(global.cf.routes + '/admin');
var checkoutRouter = require(global.cf.routes + '/checkout');
var userRouter = require(global.cf.routes + '/user');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/checkout', global.md.isLogged, checkoutRouter);
    app.use('/:username', userRouter);
};
