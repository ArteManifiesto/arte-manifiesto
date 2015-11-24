/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.WorkScreen = function () {
  APP.BaseScreen.call(this, 'work');
};

APP.WorkScreen.constructor = APP.WorkScreen;
APP.WorkScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.WorkScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
};
