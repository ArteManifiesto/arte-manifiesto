/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountApplyScreen = function () {
  APP.BaseScreen.call(this, 'accountApply');
};

APP.AccountApplyScreen.constructor = APP.AccountApplyScreen;
APP.AccountApplyScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountApplyScreen.prototype.setupUI = function() {
  $('input[name=direction]').geocomplete();
};

APP.AccountApplyScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
};
