/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.PhotoSwipe = function() {
  this.filter = 'w_1500,h_800,c_limit,q_80';

  this.isLoading = false;
  this.zoom = false;
  this.meta = null;

  this.setupUI();
  this.listeners();
};

APP.PhotoSwipe.constructor = APP.PhotoSwipe;

APP.PhotoSwipe.prototype.setupUI = function() {
  this.image = $('#work-image');
  this.pswp = $('.pswp')[0];
  this.modal = $('#go-preload-modal');
};


APP.PhotoSwipe.prototype.listeners = function() {
  this.image.click(this.imageHandler.bind(this));
};

APP.PhotoSwipe.prototype.imageHandler = function() {
  if (!this.zoom) {
    this.modal.click();

    this.isLoading = true;

    var src = Utils.addImageFilter(work.photo, this.filter);

    var scope = this;
    $('<img>').load(function() {
      scope.imageLoadHandler(this);
    }).attr('src', src);

    this.zoom = true;

  } else {
    if (this.isLoading) {
      this.modal.click();
    }
  }
};

APP.PhotoSwipe.prototype.imageLoadHandler = function(image) {
  $('#lean_overlay').click();

  this.isLoading = false;
  this.meta = {
    width: image.width,
    height: image.height
  };
  this.image.click(this.openPhotoSwipeHandler.bind(this));
  this.image.click();
};

APP.PhotoSwipe.prototype.openPhotoSwipeHandler = function() {
  var items = [{
    src: Utils.addImageFilter(work.photo, this.filter),
    w: this.meta.width,
    h: this.meta.height
  }];

  var scope = this;
  var options = {
    getThumbBoundsFn: function() {
      return {
        x: scope.image.offset.left,
        y: scope.image.offset.top + 50,
        w: scope.image.width()
      }
    }
  };
  new PhotoSwipe(this.pswp, PhotoSwipeUI_Default, items, options).init();
};