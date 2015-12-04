/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.NotificationsScreen = function () {
  APP.BaseScreen.call(this, 'notifications');
};

APP.NotificationsScreen.constructor = APP.NotificationsScreen;
APP.NotificationsScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.NotificationsScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
};
