/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.ConfirmEmailScreen = function () {
  APP.BaseScreen.call(this, 'confirmEmail');
};

APP.ConfirmEmailScreen.constructor = APP.ConfirmEmailScreen;
APP.ConfirmEmailScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.ConfirmEmailScreen.prototype.setupUI = function() {
  this.messageSuccess = $('.msg-succes');
  this.resend = $('.resend-btn');
  this.resendLoading = $('.resend-loading');
};

APP.ConfirmEmailScreen.prototype.listeners = function() {
  this.resend.click(this.resendHandler.bind(this));
};

APP.ConfirmEmailScreen.prototype.resendHandler = function() {
  this.messageSuccess.hide();
  this.resendLoading.show();
  this.resend.hide();

  this.requestHandler('/auth/resend', {}, this.resendComplete);
};

APP.ConfirmEmailScreen.prototype.resendComplete = function(response) {
  this.messageSuccess.show();
  this.resendLoading.hide();
  this.resend.show();
};
