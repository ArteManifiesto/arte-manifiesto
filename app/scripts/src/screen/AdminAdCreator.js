/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminAdCreator = function() {
  APP.BaseScreen.call(this, 'adminAdCreator');
};

APP.AdminAdCreator.constructor = APP.AdminAdCreator;
APP.AdminAdCreator.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminAdCreator.prototype.setupUI = function() {
  this.sendBtn = $('button[data-id="send"]');
  this.ads = [];
};

APP.AdminAdCreator.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.sendBtn.click(this.sendClickHandler.bind(this));

  $('input[name=adPackType]').change(this.adPackTypeChange.bind(this));
  $('input[name=adPackType][data-index="0"]').attr('checked', true).change();
};

APP.AdminAdCreator.prototype.sendClickHandler = function(e) {
  e.preventDefault();

  this.ads.map(function(value) {
    console.log(value.getData());
  });
};

APP.AdminAdCreator.prototype.adPackTypeChange = function(e) {
 	var me = $(e.target);
 	var index = me.data('index');
	var adPackType = adPackTypes[index];

	$('.images-links').empty();
  this.ads = [];
	adPackType.Types.map((function(value) {
    var ad = new APP.AdCreator(value);
    this.ads.push(ad);
  	$('.images-links').append(ad.view);
	}).bind(this));
};