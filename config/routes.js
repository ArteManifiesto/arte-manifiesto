/**
 * Load routers
 * ====================================================
 */
var subdomain = require('express-subdomain');


var pagesRouter = require(global.cf.routes + '/pages');
var authRouter = require(global.cf.routes + '/auth');
var reportRouter = require(global.cf.routes + '/report');
var blogRouter = require(global.cf.routes + '/blog');
var userRouter = require(global.cf.routes + '/user');

/**
 * Setup routers
 * ====================================================
 */
exports.init = function (app) {
  // app.use(subdomain('report', reportRouter));
  // app.use(subdomain('blog', blogRouter));

  app.use('/', pagesRouter);
  app.use('/report', global.md.isAdmin, reportRouter);
  app.use('/blog', blogRouter);
  app.use('/auth', authRouter);
  app.use('/user/:username',  userRouter);
};
