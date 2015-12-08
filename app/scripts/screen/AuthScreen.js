/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AuthScreen = function (meta) {
  this.meta = meta;
  APP.BaseScreen.call(this, 'auth');
};

APP.AuthScreen.constructor = APP.AuthScreen;
APP.AuthScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AuthScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
  $('.fb').click(this.fbHandler.bind(this));
  $('.auth-form').submit(this.formHandler.bind(this));
};

APP.AuthScreen.prototype.fbHandler = function () {
  $('.fb').hide();
  $('.fb-loading').show();
};

APP.AuthScreen.prototype.formHandler = function (event) {
  event.preventDefault();
  $('.submit').hide();
  $('.submit-loading').show();

  var url = '/auth/' + this.meta, payload = $('.auth-form').serialize();
  this.requestHandler(url, payload, this.requestAuthComplete, this.requestAuthError, true);
};

APP.AuthScreen.prototype.requestAuthError = function (response) {
  this.meta === 'signup' && grecaptcha.reset();
  $('.submit').show();
  $('.submit-loading').hide();
};

APP.AuthScreen.prototype.requestAuthComplete = function (response) {
  $('.submit').show();
  $('.submit-loading').hide();

  if(this.meta === 'reset') {
    this.showFlash('succes', 'Contraseña cambiada');
  }
  else if(this.meta === 'forgot') {
    this.showFlash('succes', 'Se envio el correo');
  }
  else {
    return location.href = response.data.returnTo;
  }
};
