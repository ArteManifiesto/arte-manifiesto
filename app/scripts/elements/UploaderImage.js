/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.UploaderImage = function (view) {
  this.$view = view;
  this.photo = '';
  this.listeners();
};

APP.UploaderImage.constructor = APP.UploaderImage;

APP.UploaderImage.prototype.listeners = function () {
  var scope = this, $uploader = $('.cloudinary-fileupload');
  $uploader.fileupload({
    start: function (e) {
      scope.$view.find('.preload').show();
    },
    fail: function (e, data) {
      scope.$view.find('.preload').hide();
    }
  })
  .off('cloudinarydone').on('cloudinarydone', function (e, data) {
    scope.$view.find('.preload').hide();
    scope.$view.find('.preview').html('');
    scope.photo = data.result.url;
    var filters =  {format: data.result.format, width: 200, height: 200, crop: "thumb"};
    $.cloudinary.image(data.result.public_id, filters).appendTo(scope.$view.find('.preview'));
  });
};
