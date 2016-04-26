/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminEditBannerScreen = function() {
  APP.BaseScreen.call(this, 'adminEditBanner');
};

APP.AdminEditBannerScreen.constructor = APP.AdminEditBannerScreen;
APP.AdminEditBannerScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminEditBannerScreen.prototype.setupUI = function() {
  this.uploader = $('.uploader-image');
  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete);
  this.sendBtn = $('.send-btn');

  this.uploaderImage.photo = banner.image;
};

APP.AdminEditBannerScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.sendBtn.click(this.sendHandler.bind(this));
};

APP.AdminEditBannerScreen.prototype.sendHandler = function(event) {
  event.preventDefault();
  var errors = [];
  if (Validations.notBlank($('input[name=link]').val())) errors.push('Ingrese un link');
  if (!this.uploaderImage.photo) errors.push('Ingrese una foto');
  if (errors.length > 0) return this.showFlash('error', errors);

  var scope = this;
  var data = $('form').serializeArray();
  $.each(data, function(index, value) {
    if (value.name === 'image')
      value.value = scope.uploaderImage.photo;
  });

  var url = '/report/banners/update';
  this.requestHandler(url, data, this.updateComplete);
};

APP.AdminEditBannerScreen.prototype.updateComplete = function(response) {
  this.showFlash('succes', 'Se edito el banner');

  setTimeout(function() {
    window.location.href = '/report/banners/';
  }, 1000);
};


APP.AdminEditBannerScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};