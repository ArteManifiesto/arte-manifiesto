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
  this.currentPhoto;

  if (this.data) {
    this.config = JSON.parse(this.data.subCategories[0].data);
    $('#canvas-product' + index).attr('width', this.config.widthView);
    $('#canvas-product' + index).attr('height', this.config.heightView);

    this.canvasColor = '#FFFFFF';
    this.canvas = new fabric.Canvas('canvas-product' + index, {
      backgroundColor: this.canvasColor
    });

    this.header.find('.background').find('img').attr('src', this.config.renderImage);
  }

  if(this.data) {
    this.setup();
  }
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

  this.view.find('.save-btn-kek').click(this.saveBtnHandler.bind(this));

  var scope = this;
  this.view.find('.cloudinary-fileupload').fileupload({
      start: function(e) {},
      fail: function(e, data) {}
    })
    .off('cloudinarydone').on('cloudinarydone', function(e, data) {
      var image = scope.canvas.item(0);
      work.photo = data.result.url;
      var scale = scope.config.scaleFactor / 10, url;
      if (this.data) {
        url = Utils.addImageFilter(work.photo, 'w_' + scale + ',h_' + scale);
      } else {
        url = Utils.addImageFilter(work.photo, 'w_0.5,h_0.5');
      }
      image.setSrc(url, function() {
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

APP.CreatorProductItem.prototype.saveBtnHandler = function(e) {
  e.preventDefault();
  this.view.addClass('hide');
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
    var scale = 1 / this.config.scaleFactor;
    url = Utils.addImageFilter(work.photo, 'w_' + scale + ',h_' + scale);
  } else {
    url = Utils.addImageFilter(work.photo, 'w_0.5,h_0.5');
  }

  console.log(url);

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

    fabric.Image.fromURL(scope.config.guideImage, function (img) {
      console.log(scope.canvas.width);
      console.log('width =>');
      console.log(img.width);
      console.log('height =>');
      console.log(img.height);
      img.evented = img.selectable = false;
      img.left = img.top = -1;
      scope.canvas.add(img);
      console.log('width =>', img.width);

      // scope.canvas.centerObject(image);
      img.setCoords();
      scope.canvas.renderAll();
    }, {
      crossOrigin: 'Anonymous'
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
  var url  = this.canvas.toDataURL({
    left: this.config.offsetX,
    top: this.config.offsetY,
    width: this.config.widthRender,
    height: this.config.heightRender
  });

  this.header.find('.image-preview').attr('src', url);

  // .css('width', 'auto').css('height', this.config.heightRender /2);

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

   console.log(Utils.addImageFilter(urlImage, filters));

  x = (Math.round(boundaries.left * this.config.scaleFactor) - (this.config.offsetX * this.config.scaleFactor));
  y = (Math.round(boundaries.top * this.config.scaleFactor) - (this.config.offsetY * this.config.scaleFactor));

    filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + rgbColor + '/' +
      'l_' + baseName + ',b_rgb:' + rgbColor + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + ((x < 0 ? (x * -1) : 0)) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + (this.config.widthRender * this.config.scaleFactor) + ',' +
      'h_' + (this.config.heightRender * this.config.scaleFactor) + ',c_crop,g_north_west/' +
      'w_' + (this.config.widthRender) + ',h_' + (this.config.heightRender) + '/l_phone_fmpg26';

    filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + rgbColor + '/' +
      'l_' + baseName + ',b_rgb:' + rgbColor + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + ((x < 0 ? (x * -1) : 0)) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + (this.config.widthRender * this.config.scaleFactor) + ',' +
      'h_' + (this.config.heightRender * this.config.scaleFactor) + ',c_crop,g_north_west/' +
      // 'w_230/e_distort:0:60:230:45:225:340:0:340/c_pad,h_2,w_1.0/l_radial,e_displace,y_-10/e_trim/u_mug'
      'w_230/e_distort:-15:90:220:60:215:360:-15:382/c_pad,h_2,w_1.0/l_radial,e_displace,y_-20/e_trim/l_new_mug/';
      // console.log('gg => ', Utils.addImageFilter(urlImage, filters));

  this.currentPhoto =  Utils.addImageFilter(urlImage, filters);

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
      canvas: JSON.stringify(this.canvas.toJSON()),
      config: JSON.stringify({
        data: JSON.parse(this.data.subCategories[index].data),
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
