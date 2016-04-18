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

  this.canvas = new fabric.Canvas('canvas-product' + index, {
    backgroundColor: 'white'
  });

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
    console.log(index);
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
  color = color.toHexString();
  this.canvas.backgroundColor = color;
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

    // if(scope.index === 4) {
    //   fabric.Image.fromURL('http://am.local:3000/4s.svg', function (img) {
    //     img.evented = img.selectable = false;
    //     scope.canvas.add(img);
    //
    //     scope.canvas.centerObject(image);
    //     img.setCoords();
    //     scope.canvas.renderAll();
    //   });
    // }
  }, {
    crossOrigin: 'Anonymous'
  });


  // this.canvas.loadFromJSON(data,  this.canvas.renderAll.bind(this.canvas), function(o, object) {
  //   fabric.log(o, object);
  // });

  this.canvas.on('mouse:up', function(options) {
    scope.renderCanvas(options);

    //
    // var baseName = url.replace(/^.*\/|\.[^.]*$/g, '')
    //
    // var imageW = Math.round(imageTemp.getWidth() * 2);
    // var imageH = Math.round(imageTemp.getHeight() * 2);
    //
    //
    // var factor = 2;
    // var a = imageTemp.getBoundingRect();
    // var x = Math.round(a.left * factor);
    // var y = (Math.round(a.top * factor));
    //
    //
    // var filters =
    // 'w_' + 1240 + ',' +
    // 'h_' + 560 + ',e_colorize,co_rgb:' + 'ff0000' + '/' +
    // 'l_' + baseName + ',b_rgb:' + 'ff0000' + ',' +
    // 'w_' + imageW + ',' +
    // 'h_' + imageH + ',' +
    // 'x_' + x + ',' +
    // 'y_' + y + ',g_north_west/' +
    // 'x_' + (x < 0 ? (x * -1) : 0) + ',' +
    // 'y_' + (y < 0 ? (y * -1) : 0) + ',' +
    // 'w_' + 1240 + ',' +
    // 'h_' + 560 + ',c_crop,g_north_west';
    //
    // var original = Utils.addImageFilter(work.photo, filters);
    // console.log(original);
  });
};

APP.CreatorProductItem.prototype.renderCanvas = function() {
  this.canvas.item(0).hasBorders = this.canvas.item(0).hasControls = false;

  this.canvas.renderAll();
  this.header.find('.image-preview').attr('src', this.canvas.toDataURL());

  this.canvas.item(0).hasBorders = this.canvas.item(0).hasControls = true;
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
      photo: work.photo,
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
