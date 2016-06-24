/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TVIndexScreen = function() {
  APP.BaseScreen.call(this, 'tvIndexScreen');
  this.holi = 'holi papu';
};

APP.TVIndexScreen.constructor = APP.TVIndexScreen;
APP.TVIndexScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.TVIndexScreen.prototype.setupUI = function() {
  this.btnSaludar = $('button[data-id=btn_saludar]');
};

APP.TVIndexScreen.prototype.listeners = function() {
  this.btnSaludar.click(this.btnSaludarHandler.bind(this));
};

APP.TVIndexScreen.prototype.btnSaludarHandler = function() {
};


APP.TVIndexScreen.prototype.saludar = function() {
	console.log('saludar');
}

