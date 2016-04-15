/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CreatorProductItem = function (index) {
  this.index = index;
  this.view = $('.grid-product-' + index);
  this.header = $('div[data-prod=' + index + ']');
  this.canvas = new fabric.Canvas('canvas-product' + index);
  this.setup();

  this.listeners();
};

APP.CreatorProductItem.constructor = APP.CreatorProductItem;

APP.CreatorProductItem.prototype.listeners = function() {
  var scope = this;
};

APP.CreatorProductItem.prototype.setup = function() {
  // var data = {"objects":[{"type":"image","originX":"left","originY":"top","left":13.4,"top":18.06,"width":720,"height":1080,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.42,"scaleY":0.42,"angle":0.27,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"src":"http://fabricjs.com/assets/pug.jpg","filters":[],"crossOrigin":"","alignX":"none","alignY":"none","meetOrSlice":"meet"}],"background":""};
  var scope = this;

  var url = Utils.addImageFilter(work.photo, 'w_0.5,h_0.5');
  // console.log(work.photo);
  // console.log(url);
  // work.photo =
  var imageTemp;

    fabric.Image.fromURL(url, function (image) {
      imageTemp = image;
      var ratio = image.width / image.height;
      if(image.width > 560) image.width = 560; image.height = 560 / ratio;

      console.log(image.width);
      scope.canvas.add(image);
      scope.canvas.calcOffset();
      scope.canvas.sendToBack(image);
      scope.canvas.setActiveObject(scope.canvas.item(0));
      scope.canvas.item(0).lockRotation = true;
      scope.canvas.item(0).hasRotatingPoint = false;
      scope.canvas.item(0).lockUniScaling = true;

      scope.canvas.centerObject(image);
      image.setCoords();
    }, {crossOrigin: 'Anonymous'});

    // this.canvas.loadFromJSON(data,  this.canvas.renderAll.bind(this.canvas), function(o, object) {
    //   fabric.log(o, object);
    // });

    this.canvas.on('mouse:up', function(options) {
      options.target.hasBorders = options.target.hasControls = false;
      scope.canvas.renderAll();

      scope.header.find('.image-preview').attr('src', scope.canvas.toDataURL());

      options.target.hasBorders = options.target.hasControls = true;
      scope.canvas.renderAll();

      var baseName = url.replace(/^.*\/|\.[^.]*$/g, '')

      var imageW = Math.round(imageTemp.getWidth() * 2);
      var imageH = Math.round(imageTemp.getHeight() * 2);


      var factor = 2;
      var a = imageTemp.getBoundingRect();
      var x = Math.round(a.left * factor);
      var y = (Math.round(a.top * factor));


      var filters =
      'w_' + 1240 + ',' +
      'h_' + 560 + ',e_colorize,co_rgb:' + 'ff0000' + '/' +
      'l_' + baseName + ',b_rgb:' + 'ff0000' + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + (x < 0 ? (x * -1) : 0) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + 1240 + ',' +
      'h_' + 560 + ',c_crop,g_north_west';

      var original = Utils.addImageFilter(work.photo, filters);
      console.log(original);
    });
};

APP.CreatorProductItem.prototype.open = function() {
  this.view.removeClass('hide');
};

APP.CreatorProductItem.prototype.close = function() {
  this.view.addClass('hide');
};
