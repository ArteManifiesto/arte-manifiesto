/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CreatorProductItem = function(index, data) {
  this.index = index;
  this.view = $('.grid-product-' + index);
  this.header = $('div[data-prod=' + index + ']');

  this.data = data;
  if (this.data) {
    this.config = JSON.parse(this.data.subCategories[0].data);
    $('#canvas-product' + index).attr('width', this.config.widthView);
    $('#canvas-product' + index).attr('height', this.config.heightView);
  }

  this.canvasColor = '#FFFFFF';
  this.canvas = new fabric.Canvas('canvas-product' + index, {
    backgroundColor: this.canvasColor
  });

  this.currentPhoto;

  this.setup();
  this.listeners();
};

APP.CreatorProductItem.constructor = APP.CreatorProductItem;

APP.CreatorProductItem.prototype.listeners = function() {
  var scope = this;

  this.view.find('.part-btn-1').click(this.partBtn1Handler.bind(this));
  this.view.find('.part-btn-2').click(this.partBtn2Handler.bind(this));

  this.view.find('.vertical-align').click(this.verticalAlign.bind(this));
  this.view.find('.horizontal-align').click(this.horizontalAlign.bind(this));
  this.view.find('input[type=range]').change(this.productScaleHandler.bind(this));

  var scope = this;
  this.view.find('.cloudinary-fileupload').fileupload({
      start: function(e) {},
      fail: function(e, data) {}
    })
    .off('cloudinarydone').on('cloudinarydone', function(e, data) {
      var image = scope.canvas.item(0);
      image.setSrc(data.result.url, function() {
        image.setCoords();
        scope.canvas.renderAll();
        scope.renderCanvas();
      }, {
        crossOrigin: 'Anonymous'
      });
    });

  var scope = this;
  this.view.find('.margen-input').keyup(function() {
    var index = $(this).data('index');
    var baseprice = $(this).data('baseprice');
    var currentValue = $(this).val();
    var percentage = (currentValue / 100) * baseprice;
    var finalprice = baseprice + percentage;

    scope.data.subCategories[index].finalPrice = finalprice;
    scope.data.subCategories[index].margen = currentValue;

    $($(this).parent().find('p')[1]).text('S/.' + finalprice);
  });
  this.view.find('.margen-input').keyup();
};

APP.CreatorProductItem.prototype.productScaleHandler = function(e) {
  var value = e.target.value / 100;
  var image = this.canvas.item(0);
  image.scaleX = image.scaleY = value;
  image.setCoords();
  this.canvas.renderAll();

  this.renderCanvas();
};

APP.CreatorProductItem.prototype.verticalAlign = function(e) {
  e.preventDefault();
  var image = this.canvas.item(0);
  this.canvas.centerObjectV(image);
  image.setCoords();
  this.canvas.renderAll();
  this.renderCanvas();
};

APP.CreatorProductItem.prototype.horizontalAlign = function(e) {
  e.preventDefault();
  var image = this.canvas.item(0);
  this.canvas.centerObjectH(image);
  image.setCoords();
  this.canvas.renderAll();
  this.renderCanvas();
};

APP.CreatorProductItem.prototype.partBtn1Handler = function(e) {
  this.view.find('.part-btn-1').addClass('selected');
  this.view.find('.part-btn-2').removeClass('selected');
  this.view.find('.sales-right-1').show();
  this.view.find('.sales-right-2').hide();
};

APP.CreatorProductItem.prototype.partBtn2Handler = function(e) {
  this.view.find('.part-btn-1').removeClass('selected');
  this.view.find('.part-btn-2').addClass('selected');
  this.view.find('.sales-right-1').hide();
  this.view.find('.sales-right-2').show();
};

APP.CreatorProductItem.prototype.colorChangeHandler = function(color) {
  this.canvasColor = color.toHexString();
  this.canvas.backgroundColor = this.canvasColor;
  this.canvas.renderAll();
  this.renderCanvas();
};

APP.CreatorProductItem.prototype.setup = function() {
  var colorsConf = {
    showPaletteOnly: true,
    showPalette: true,
    color: 'white',
    palette: [
      ['black', 'white', 'blanchedalmond',
        'rgb(255, 128, 0);', 'hsv 100 70 50'
      ],
      ['red', 'yellow', 'green', 'blue', 'violet']
    ],
    change: this.colorChangeHandler.bind(this)
  }
  this.view.find("#colorPicker").spectrum(colorsConf);


  var scope = this;
  var url;
  if (this.data) {
    var scale = this.config.scaleFactor / 10;
    url = Utils.addImageFilter(work.photo, 'w_' + scale + ',h_' + scale);
  } else {
    url = Utils.addImageFilter(work.photo, 'w_0.5,h_0.5');
  }
  var imageTemp;


  fabric.Image.fromURL(url, function(image) {
    imageTemp = image;
    // var ratio = image.width / image.height;
    // if(image.width > 560) image.width = 560; image.height = 560 / ratio;

    scope.canvas.add(image);
    scope.canvas.calcOffset();
    scope.canvas.sendToBack(image);
    scope.canvas.setActiveObject(scope.canvas.item(0));
    scope.canvas.item(0).lockRotation = true;
    scope.canvas.item(0).hasRotatingPoint = false;
    scope.canvas.item(0).lockUniScaling = true;

    scope.canvas.centerObject(image);
    image.setCoords();

    scope.renderCanvas();

    fabric.Image.fromURL('http://am.local:3000/4s.svg', function (img) {
      img.evented = img.selectable = false;
      scope.canvas.add(img);
      console.log('width =>', img.width);

      scope.canvas.centerObject(image);
      img.setCoords();
      scope.canvas.renderAll();
    });
  }, {
    crossOrigin: 'Anonymous'
  });

  // this.canvas.loadFromJSON(data,  this.canvas.renderAll.bind(this.canvas), function(o, object) {
  //   fabric.log(o, object);
  // });

  this.canvas.on('mouse:up', function(options) {
    scope.renderCanvas(options);
  });
};

APP.CreatorProductItem.prototype.renderCanvas = function() {
  var image = this.canvas.item(0);
  image.hasBorders = image.hasControls = false;
  if(this.canvas.item(1)) {
    this.canvas.item(1).opacity = 0;
  }

  this.canvas.renderAll();
  this.header.find('.image-preview').attr('src', this.canvas.toDataURL({
    left: 41,
    top: 41,
    width: 230,
    height: 459
  }));

  var urlImage = work.photo;
  var baseName = urlImage.replace(/^.*\/|\.[^.]*$/g, '')

  var boundaries = image.getBoundingRect();
  var x = Math.round(boundaries.left * this.config.scaleFactor);
  var y = Math.round(boundaries.top * this.config.scaleFactor);
  var stageW = Math.round(this.config.widthView * this.config.scaleFactor);
  var stageH = Math.round(this.config.heightView * this.config.scaleFactor);
  var imageW = Math.round(image.getWidth() * this.config.scaleFactor);
  var imageH = Math.round(image.getHeight() * this.config.scaleFactor);
  var rgbColor = this.canvasColor.replace('#','');
  var filters =
    'w_' + stageW + ',' +
    'h_' + stageH + ',e_colorize,co_rgb:' + rgbColor + '/' +
    'l_' + baseName + ',b_rgb:' + rgbColor + ',' +
    'w_' + imageW + ',' +
    'h_' + imageH + ',' +
    'x_' + x + ',' +
    'y_' + y + ',g_north_west/' +
    'x_' + (x < 0 ? (x * -1) : 0) + ',' +
    'y_' + (y < 0 ? (y * -1) : 0) + ',' +
    'w_' + stageW + ',' +
    'h_' + stageH + ',c_crop,g_north_west';

  this.currentPhoto = Utils.addImageFilter(urlImage, filters);

  this.header.find('.image-preview').attr('width', 125);

  image.hasBorders = image.hasControls = true;
  if(this.canvas.item(1)) {
    this.canvas.item(1).opacity = 1;
  }
  this.canvas.renderAll();
};

APP.CreatorProductItem.prototype.open = function() {
  this.view.removeClass('hide');
};

APP.CreatorProductItem.prototype.getPayload = function() {
  var checked = this.view.find('input[type=checkbox]:checked');
  var result = [];
  for (var i = 0; i < checked.length; i++) {
    var index = $(checked[i]).data('index');
    var subcategory = this.data.subCategories[index];
    var item = {
      WorkId: work.id,
      CategoryId: this.data.subCategories[index].id,
      name: work.name,
      photo: this.currentPhoto,
      finalPrice: subcategory.finalPrice.toString(),
      description: work.description,
      config: JSON.stringify({
        margen: subcategory.margen,
        range: this.view.find('input[type=range]').val(),
        bgCanvas: this.canvas.backgroundColor
      })
    };
    result.push(item);
  }
  return result;
};

APP.CreatorProductItem.prototype.close = function() {
  this.view.addClass('hide');
};
