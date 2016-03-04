/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountSellerScreen = function () {
  APP.BaseScreen.call(this, 'accountSeller');
};

APP.AccountSellerScreen.constructor = APP.AccountSellerScreen;
APP.AccountSellerScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountSellerScreen.prototype.setupUI = function() {
  this.saveBtn = $('.save-btn');

  this.country  = $('input[name=country]');
  this.city  = $('input[name=city]');
  this.province  = $('input[name=province]');
  this.zipcode  = $('input[name=zipcode]');
  this.direction  = $('input[name=direction]');
  this.phone  = $('input[name=phone]');
  this.paypal  = $('input[name=paypal]');
  this.document = $('select[name=document]');
  this.documentValue = $('input[name=documentValue]');
  this.businessName = $('input[name=businessName]');

  this.form = $('.complete-form');

  this.direction.geocomplete();
};

APP.AccountSellerScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.form.submit(this.submitHandler.bind(this));
  // this.saveBtn.click(this.saveBtnHandler.bind(this));
};

APP.AccountSellerScreen.prototype.submitHandler = function (e) {
  e.preventDefault();
  var errors = [] , scope = this;

  if(Validations.notBlank(this.firstname.val())) errors.push('Ingrese sus nombre');
  if(Validations.notBlank(this.lastname.val())) errors.push('Ingrese sus apellidos');
  if(Validations.notBlank(this.username.val())) errors.push('Ingrese su nombre de usuario');
  if(!Validations.username(this.username.val())) errors.push('Nombre de usuario solo acepta numeros y letras');
  if(Validations.notBlank(this.gender.val())) errors.push('Ingrese su genero');
  if(Validations.notBlank(this.birthday.val())) errors.push('Ingrese su cumpleaños');
  if(Validations.notBlank(this.country.val())) errors.push('Ingrese su pais');
  if(Validations.notBlank(this.city.val())) errors.push('Ingrese su ciudad');
  // if(Validations.notBlank(this.biography.val())) errors.push('Ingrese su biografia');

  if(this.typeName.val() === '2') {
    if(Validations.notBlank(this.pseudonimo.val())) errors.push('Ingrese su pseudonimo');
  }

};
