/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.UploaderImage = function (data) {
  var config = {
    "api_key": "337494525976864",
    "cloud_name": "hackdudes",
    "private_cdn": false
  };
  $.cloudinary.config(config);

  APP.BaseElement.call(this, data, data.template);
  this.photo = '';
};

APP.UploaderImage.prototype = Object.create(APP.BaseElement.prototype);

APP.UploaderImage.constructor = APP.UploaderImage;

APP.UploaderImage.prototype.listeners = function () {
  var scope = this, $uploader = $('.cloudinary-fileupload');
  $uploader.fileupload({
    start: function (e) {
      $('.preload').show();
      $('.upload').hide();
    },
    fail: function (e, data) {
      $('.upload').show();
    }
  })
  .off('cloudinarydone').on('cloudinarydone', function (e, data) {
    $('.preload').hide();
      $('.preview').html('');
    scope.photo = data.result.url;
    var filters =  {format: data.result.format, width: 200,
      height: 200, crop: "thumb"};
    $.cloudinary.image(data.result.public_id, filters).appendTo($('.preview'));
  });
};
