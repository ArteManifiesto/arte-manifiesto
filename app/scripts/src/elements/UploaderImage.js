/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.UploaderImage = function (view, onComplete, options) {
  this.$view = view;
  this.photo = null;
  this.options = options || {uploader: $('.cloudinary-fileupload')};
  this.uploader = this.options.uploader;
  this.listeners();
  this.onComplete = onComplete;
};

APP.UploaderImage.constructor = APP.UploaderImage;

APP.UploaderImage.prototype.listeners = function () {
  var scope = this;
  this.uploader.fileupload({
    start: function (e) {
      scope.$view.find('.upload').hide();
      $(this).hide();
      scope.$view.find('.preload').removeClass('hide');
      scope.$view.find('.preload').show();
    },
    fail: function (e, data) {
      scope.$view.find('.upload').show();
      $(this).show();
      scope.$view.find('.preload').hide();
    }
  })
  .off('cloudinarydone').on('cloudinarydone', function (e, data) {
    console.log('data======>')
    console.log(data);
    scope.$view.find('.preload').hide();
    scope.$view.find('.preview').html('');
    scope.photo = data.result.url;
    if(!scope.onComplete) {
      var src = Utils.addImageFilter(data.result.url, 'w_200,h_200,c_thumb');
      this.$view.find('.preview').append($('<img>', {src: src}));
    }else {
      scope.onComplete(data.result.public_id);
    }
  });
};
