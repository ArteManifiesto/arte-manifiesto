/**
 * Load routers
 * ====================================================
 */

var subdomain = require('express-subdomain');


var pagesRouter = require(global.cf.routes + '/pages');
var authRouter = require(global.cf.routes + '/auth');
var reportRouter = require(global.cf.routes + '/report');
var userRouter = require(global.cf.routes + '/user');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use(subdomain('report', reportRouter));

    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/user/:username', userRouter);
};
