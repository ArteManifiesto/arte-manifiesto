var express = require('express');

/**
 * Load routers
 * ====================================================
 */

var pagesRouter = require(global.cf.routes + '/pages');
var authRouter = require(global.cf.routes + '/auth');
var adminRouter = require(global.cf.routes + '/admin');
var blogRouter = require(global.cf.routes + '/blog');
var userRouter = require(global.cf.routes + '/user');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/blog', blogRouter);
    app.use('/user/:username', userRouter);
};
