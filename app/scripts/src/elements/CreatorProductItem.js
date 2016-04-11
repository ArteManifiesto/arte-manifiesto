/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CreatorProductItem = function (data) {
  this.view = data.view;
  if(this.view.hasClass('grid-1')) {
    this.canvas = new fabric.Canvas('product1');
  }
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

  if(this.canvas) {
    fabric.Image.fromURL(work.photo, function (image) {
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

      $('div[data-prod="1"]').find('img').attr('src', scope.canvas.toDataURL());

      options.target.hasBorders = options.target.hasControls = true;
      scope.canvas.renderAll();
    });
  }
};

APP.CreatorProductItem.prototype.open = function() {
  this.view.removeClass('hide');
};

APP.CreatorProductItem.prototype.close = function() {
  this.view.addClass('hide');
};
