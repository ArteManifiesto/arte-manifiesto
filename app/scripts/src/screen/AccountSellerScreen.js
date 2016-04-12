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

  this.country  = $('select[name=country]');
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

  this.country.find('option:contains(' + user.country + ')').attr('selected', true);
  this.city.val(user.city);
  this.document.find('option:contains(' + user.document + ')').attr('selected', true);

  this.terms = $('input[name=terms]');

  this.direction.geocomplete();

  this.deleteStoreBtn = $('.delete-store');

  this.createStoreBtn = $('.create-store-btn');
};

APP.AccountSellerScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.form.submit(this.submitHandler.bind(this));
  this.deleteStoreBtn.click(this.deleteStoreBtnHandler.bind(this));
  this.createStoreBtn.click(this.createStoreBtnHandler.bind(this));
  this.country.change(this.countryChangeHandler.bind(this));
};

APP.AccountSellerScreen.prototype.countryChangeHandler = function (e) {
  this.country.val() === 'Peru' ? $('.country-container').show() : $('.country-container').hide();
};

APP.AccountSellerScreen.prototype.createStoreBtnHandler = function (e) {
  e.preventDefault();

  $('#seller-invitation').hide();
  $('#seller-validation').show();
};

APP.AccountSellerScreen.prototype.deleteStoreBtnHandler = function (e) {
  var url = '/user/' + user.username + '/account/unseller';
  this.requestHandler(url, {}, this.afterUnSeller);
};

APP.AccountSellerScreen.prototype.afterUnSeller = function (e) {
  this.showFlash('succes', 'Se ha desactivado tu tienda');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = '/user/' + user.username;
  }, 1000);
};

APP.AccountSellerScreen.prototype.submitHandler = function (e) {
  e.preventDefault();
  var errors = [] , scope = this;

  if(Validations.notBlank(this.country.val())) errors.push('Seleccione su pais');
  if(Validations.notBlank(this.city.val())) errors.push('Seleccione su ciudad');

  if(Validations.notBlank(this.province.val())) errors.push('Ingrese una provincia');
  if(Validations.notBlank(this.zipcode.val())) errors.push('Ingrese el código postal');

  if(Validations.notBlank(this.direction.val())) errors.push('Ingrese su dirección');
  if(Validations.notBlank(this.phone.val())) errors.push('Ingrese su teléfono');

  if(!Validations.email(this.paypal.val())) errors.push('Ingrese su cuenta de paypal válida');

  if(this.country.val() === 'Peru') {
    if(Validations.notBlank(this.document.val())) errors.push('Seleccione un documento');
    if(Validations.notBlank(this.documentValue.val())) errors.push('Ingrese el nro del documento');
    if(Validations.notBlank(this.businessName.val())) errors.push('Ingrese el nombre de la razón social');
  }

  if(!user.isSeller)
    if(!this.terms.prop('checked')) errors.push('Acepta los términos y condiciones');

  if(errors.length > 0) return this.showFlash('error', errors);

  var data = this.form.serializeArray();
  var url = '/user/' + user.username + '/account/seller';
  this.requestHandler(url, data, this.afterSaveHandler);
};

APP.AccountSellerScreen.prototype.afterSaveHandler = function(response) {
  this.showFlash('succes', 'Se actualizo tu información');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = '/user/' + user.username + '/account/seller';
  }, 1000);
}
