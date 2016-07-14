/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountConfigurationScreen = function() {
  APP.BaseScreen.call(this, 'accountConfiguration');
};

APP.AccountConfigurationScreen.constructor = APP.AccountConfigurationScreen;
APP.AccountConfigurationScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountConfigurationScreen.prototype.setupUI = function() {
  this.delete = $('.delete');
  this.deleteForce = $('.work-delete-force');
  this.cancel = $('.cancel-icon');
  $('.work-delete-confirm').hide();
};

APP.AccountConfigurationScreen.prototype.listeners = function() {
  this.delete.click(this.deleteStoreBtnHandler.bind(this));
  this.deleteForce.click(this.deleteForceHandler.bind(this));
  this.cancel.click(this.cancelBtnHandler.bind(this));
};

APP.AccountConfigurationScreen.prototype.cancelBtnHandler = function(e) {
  e.preventDefault();
  $('.work-delete-confirm').hide();
  this.delete.show();
};

APP.AccountConfigurationScreen.prototype.deleteForceHandler = function(e) {
  e.preventDefault();
  var url = '/user/' + user.username + '/account/deactivate';
  this.requestHandler(url, {}, this.afterUnSeller);
};

APP.AccountConfigurationScreen.prototype.deleteStoreBtnHandler = function(e) {
  e.preventDefault();
  this.delete.hide();
  $('.work-delete-confirm').show();
};
APP.AccountConfigurationScreen.prototype.afterUnSeller = function(e) {
  this.showFlash('succes', 'Se ha desactivado tu cuenta');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = '/';
  }, 1000);
};