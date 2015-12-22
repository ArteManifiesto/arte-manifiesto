/**
 * Load routers
 * ====================================================
 */

var pagesRouter = require(global.cf.routes + '/pages');
var authRouter = require(global.cf.routes + '/auth');
var reportRouter = require(global.cf.routes + '/report');
var userRouter = require(global.cf.routes + '/user');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
    app.use('/', pagesRouter);
    app.use('/auth', authRouter);
    app.use('/report', reportRouter);
    app.use('/user/:username', userRouter);
};
