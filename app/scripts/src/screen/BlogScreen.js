/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BlogScreen = function () {
  APP.BaseScreen.call(this, 'blog');
};

APP.BlogScreen.constructor = APP.BlogScreen;
APP.BlogScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.BlogScreen.prototype.setupUI = function () {
  this.viewer = new APP.Viewer('post', $('.articles-container'), 'infinite', posts);
};
