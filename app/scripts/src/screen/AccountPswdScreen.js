/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountPasswordScreen = function () {
  APP.BaseScreen.call(this, 'accountPassword');

  this.timeout = null;
  this.isUserAvailable = true;
};

APP.AccountPasswordScreen.constructor = APP.AccountPasswordScreen;
APP.AccountPasswordScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountPasswordScreen.prototype.setupUI = function() {
  this.uploaderImage = new APP.UploaderImage($('.uploader-profile'), this.uploaderImageComplete);
  this.uploaderImage.photo = DataApp.currentUser.photo;

  this.save = $('.save');
  this.saveLoading = $('.save-loading');
  this.password = $('.password');
  this.rePassword = $('.rePassword');
  this.form = $('.password-form');

  this.form.submit(this.formHandler.bind(this));
};

APP.AccountPasswordScreen.prototype.formHandler = function(event) {
  event.preventDefault();
  if(this.password.val() !== this.rePassword.val())
    return this.showFlash('error', 'Las contraseñas no coinciden');

  var url = '/user/' + profile.username + '/account/password';
  this.requestHandler(url, this.form.serialize(), this.changePasswordHandler);
};

APP.AccountPasswordScreen.prototype.changePasswordHandler = function(response) {
  this.showFlash('succes', 'Contraseña cambiada');
};
