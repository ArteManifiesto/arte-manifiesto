/**
 * Load routers
 * ====================================================
 */
var subdomain = require('express-subdomain');

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
  app.use(subdomain('blog', blogRouter));
  app.use(subdomain('admin', adminRouter));
  
  app.use('/', pagesRouter);
  app.use('/auth', authRouter);
  app.use('/user/:username', userRouter);
};
