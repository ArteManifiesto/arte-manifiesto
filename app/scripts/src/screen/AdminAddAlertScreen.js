/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminAddAlertScreen = function() {
  APP.BaseScreen.call(this, 'adminAddAlertScreen');
};

APP.AdminAddAlertScreen.constructor = APP.AdminAddAlertScreen;
APP.AdminAddAlertScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminAddAlertScreen.prototype.setupUI = function() {
  this.name = $('input[name=name]');
  this.background = $('input[name=background]');
  this.text = $('input[name=text]');
  this.buttonColor = $('input[name=buttonColor]');
  this.buttonText = $('input[name=buttonText]');
  this.buttonLink = $('input[name=buttonLink]');
};

APP.AdminAddAlertScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  $('form').submit(this.formSubmit.bind(this));
};

APP.AdminAddAlertScreen.prototype.formSubmit = function(e) {
  e.preventDefault();

  var payload = {
    name: this.name.val(),
    background: this.background.val(),
    text: this.text.val(),
    buttonColor: this.buttonColor.val(),
    buttonText: this.buttonText.val(),
    buttonLink: this.buttonLink.val()
  };

  if(edit)  {
    payload.idAlert = alertToEdit.id;
    payload.edit = true;
  }

  var url = DataApp.baseUrl + 'report/alerts/add';
  this.requestHandler(url, payload, this.afterAlertComplete);
};

APP.AdminAddAlertScreen.prototype.afterAlertComplete = function(e) {
  if(edit) {
    this.showFlash('succes', 'Alerta actualizada');
  } else {
    this.showFlash('succes', 'Alerta creada');
  }

  var timeout = setTimeout(function() {
    clearTimeout();
    return location.href = '/report/alerts/';
  }, 1000);
};

// APP.AdminAddAlertScreen.prototype.adPackTypeChange = function(e) {
//  	var me = $(e.target);
//  	var index = me.data('index');
// 	var adPackType = adPackTypes[index];

// 	$('.images-links').empty();
//   this.ads = [];
// 	adPackType.Types.map((function(value) {
//     var ad = new APP.AdCreator(value);
//     this.ads.push(ad);
//   	$('.images-links').append(ad.view);
// 	}).bind(this));
// };