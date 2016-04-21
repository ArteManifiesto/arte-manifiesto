/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminProductRevisionScreen = function() {
  APP.BaseScreen.call(this, 'adminEditBanner');
};

APP.AdminProductRevisionScreen.constructor = APP.AdminProductRevisionScreen;
APP.AdminProductRevisionScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminProductRevisionScreen.prototype.setupUI = function() {
  this.deniedBtn = $('.btn-denied');
  this.acceptedBtn = $('.btn-accepted');

  this.reason = $('select[name=reason]');
  this.message = $('textarea[name=message]');

  this.deniedForm = $('.denied-form');
};

APP.AdminProductRevisionScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.deniedBtn.click(this.deniedHandler.bind(this));
  this.acceptedBtn.click(this.acceptedHandler.bind(this));
  this.deniedForm.submit(this.deniedFormSubmit.bind(this));
};

APP.AdminProductRevisionScreen.prototype.deniedFormSubmit = function(e) {
  e.preventDefault();

  var errors = [],
    scope = this;
  if (Validations.notBlank(this.reason.val())) errors.push('Ingrese un motivo');
  if (Validations.notBlank(this.message.val())) errors.push('Ingrese un mensaje');
  if (errors.length > 0) return this.showFlash('error', errors);

  var data = {
    idProduct: product.id,
    published: false,
    reason: this.reason.val(),
    message: this.message.val()
  };
  var url = '/report/products/update';
  this.requestHandler(url, data, this.productUpdateComplete);
};

APP.AdminProductRevisionScreen.prototype.productUpdateComplete = function(response) {
  this.showFlash('succes', 'Se respondio la solicitud del producto');
  setTimeout(function() {
    window.location.href = '/report/products_applying/page-1';
  }, 1000);
};

APP.AdminProductRevisionScreen.prototype.deniedHandler = function(e) {
  e.preventDefault();
  $('.form-container').removeClass('hide');
};

APP.AdminProductRevisionScreen.prototype.acceptedHandler = function(e) {
  e.preventDefault();
  var data = {
    idProduct: product.id,
    published: true
  };
  var url = '/report/products/update';
  this.requestHandler(url, data, this.productUpdateComplete);
};