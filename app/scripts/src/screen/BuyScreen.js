/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BuyScreen = function() {
  APP.BaseScreen.call(this, 'buy');
};

APP.BuyScreen.constructor = APP.BuyScreen;
APP.BuyScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.BuyScreen.prototype.setupUI = function() {
  this.payBtn = $('.btn-pay');
};

APP.BuyScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
};