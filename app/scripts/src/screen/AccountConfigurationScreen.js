/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountConfigurationScreen = function () {
  APP.BaseScreen.call(this, 'accountConfiguration');
};

APP.AccountConfigurationScreen.constructor = APP.AccountConfigurationScreen;
APP.AccountConfigurationScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountConfigurationScreen.prototype.setupUI = function() {
  this.delete = $('.delete');
};

APP.AccountConfigurationScreen.prototype.listeners = function () {
  this.delete.click(this.deleteStoreBtnHandler.bind(this));
};

APP.AccountConfigurationScreen.prototype.deleteStoreBtnHandler = function (e) {
  var url = '/user/' + user.username + '/account/deactivate';
  this.requestHandler(url, {}, this.afterUnSeller);
};
APP.AccountConfigurationScreen.prototype.afterUnSeller = function (e) {
  this.showFlash('succes', 'Se ha desactivado tu cuenta');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = '/';
  }, 1000);
};
