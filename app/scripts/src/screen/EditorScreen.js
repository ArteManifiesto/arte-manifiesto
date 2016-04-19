/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.EditorScreen = function() {
  APP.BaseScreen.call(this, 'home');
};

APP.EditorScreen.constructor = APP.EditorScreen;
APP.EditorScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.EditorScreen.prototype.setupUI = function() {

  var config = {
    scaleFactor: 5,
    width: 567,
    height: 211,
    offsetX: 0,
    offsetY: 60
  };
  var color = '000000';

  var canvas = new fabric.Canvas('c1', {
    'backgroundColor': color,
    'width': config.width + (config.offsetX * 2),
    'height': config.height + (config.offsetY * 2)
  });

  var rect = new fabric.Rect({
    width: config.width,
    height: config.offsetY,
    left: 0,
    top: 0,
    fill: 'red',
    opacity: 0.5
  });
  var rect2 = new fabric.Rect({
    width: config.width,
    height: config.offsetY,
    left: 0,
    top: config.height + config.offsetY,
    fill: 'red',
    opacity: 0.5
  });

  rect.selectable = rect2.selectable = false;

  var imageTemp;


  var addImageFilter = function(url, filter) {
    return url.replace('upload/', 'upload/' + filter + '/');
  }

  var urlImage = 'http://res.cloudinary.com/hackdudes/image/upload/v1449719700/prueba2_e4tx4f.jpg';
  // var urlImage = 'http://res.cloudinary.com/hackdudes/image/upload/v1449596597/igw5cweq4gswvepaongi.jpg'
  var baseName = urlImage.replace(/^.*\/|\.[^.]*$/g, '')
  url = addImageFilter(urlImage, 'w_0.2,h_0.2');
  fabric.Image.fromURL(url, function(image) {
    imageTemp = image;
    //  image.scale(0.2);
    //  image.hasBorders = image.hasControls = image.hasRotatingPoint = false;
    canvas.add(image);
    canvas.calcOffset();

    canvas.sendToBack(image);
    canvas.setActiveObject(canvas.item(0));
    // canvas.item(0).hasBorders = false;
    canvas.item(0).lockRotation = true;
    canvas.item(0).hasRotatingPoint = false;
    canvas.item(0).lockUniScaling = true;
    canvas.centerObject(image);
    image.setCoords();
  }, {
    crossOrigin: 'Anonymous'
  });
  canvas.add(rect);
  canvas.add(rect2);

  $('input[type=color]').change(function() {
    color = $(this).val().replace('#', '');
    canvas.backgroundColor = '#' + color;
    canvas.renderAll();
  });

  var updateControls = function() {
    var source = canvas.toDataURL({
      top: config.offsetY,
      left: config.offsetX,
      height: config.height,
      width: config.weight
    });
    $('.preview').attr('src', source);
  }

  var original;
  var left;
  var center;
  var right;

  var lel = function() {
    var a = imageTemp.getBoundingRect();
    var x = Math.round(a.left * config.scaleFactor);
    var y = (Math.round(a.top * config.scaleFactor) - (60 * config.scaleFactor));
    var stageW = Math.round(config.width * config.scaleFactor);
    var stageH = Math.round(config.height * config.scaleFactor);
    var imageW = Math.round(imageTemp.getWidth() * config.scaleFactor);
    var imageH = Math.round(imageTemp.getHeight() * config.scaleFactor);
    var portion = Math.round(stageW / 3);

    var filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + color + '/' +
      'l_' + baseName + ',b_rgb:' + color + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + (x < 0 ? (x * -1) : 0) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + stageW + ',' +
      'h_' + stageH + ',c_crop,g_north_west';
    original = addImageFilter(urlImage, filters);

    // var filters =
    // 'w_' + stageW + ',' +
    // 'h_' + stageH + ',e_colorize,co_rgb:' + color + '/' +
    // 'l_' + baseName + ',b_rgb:' + color + ',' +
    // 'w_' + imageW + ',' +
    // 'h_' + imageH + ',' +
    // 'x_' + x + ',' +
    // 'y_' + y + ',g_north_west/' +
    // 'x_' + (x < 0 ? (x * -1) : 0) + ',' +
    // 'y_' + (y < 0 ? (y * -1) : 0) + ',' +
    // 'w_' + stageW + ',' +
    // 'h_' + stageH + ',c_crop,g_north_west';
    // var temp = addImageFilter(urlImage, filters);
    // window.open(temp, '_blank');

    config.scaleFactor = 1.5;
    x = Math.round(a.left * config.scaleFactor);
    y = (Math.round(a.top * config.scaleFactor) - (60 * config.scaleFactor));
    stageW = Math.round(config.width * config.scaleFactor);
    stageH = Math.round(config.height * config.scaleFactor);
    imageW = Math.round(imageTemp.getWidth() * config.scaleFactor);
    imageH = Math.round(imageTemp.getHeight() * config.scaleFactor);
    portion = Math.round(stageW / 3);
    var stripe = 8;
    var distortion = -13;


    filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + color + '/' +
      'l_' + baseName + ',b_rgb:' + color + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + ((x < 0 ? (x * -1) : 0)) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + portion + ',' +
      'h_' + stageH + ',c_crop,g_north_west/' +
      'e_distort:0:0:' + portion + ':0:' + (portion - stripe) + ':' + stageH + ':' + stripe + ':' + stageH + '/' +
      'c_pad,h_2.0,w_1.0/l_radial,e_displace,y_' + distortion + '/e_trim/u_mugleft/w_0.7';
    left = addImageFilter(urlImage, filters);

    filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + color + '/' +
      'l_' + baseName + ',b_rgb:' + color + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + ((x < 0 ? (x * -1) : 0) + (Math.round(portion) * 1)) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + portion + ',' +
      'h_' + stageH + ',c_crop,g_north_west/' +
      'e_distort:0:0:' + portion + ':0:' + (portion - stripe) + ':' + stageH + ':' + stripe + ':' + stageH + '/' +
      'c_pad,h_2.0,w_1.0/l_radial,e_displace,y_' + distortion + '/e_trim/u_mugcenter/w_0.7';
    center = addImageFilter(urlImage, filters);

    filters =
      'w_' + stageW + ',' +
      'h_' + stageH + ',e_colorize,co_rgb:' + color + '/' +
      'l_' + baseName + ',b_rgb:' + color + ',' +
      'w_' + imageW + ',' +
      'h_' + imageH + ',' +
      'x_' + x + ',' +
      'y_' + y + ',g_north_west/' +
      'x_' + ((x < 0 ? (x * -1) : 0) + (Math.round(portion) * 2)) + ',' +
      'y_' + (y < 0 ? (y * -1) : 0) + ',' +
      'w_' + portion + ',' +
      'h_' + stageH + ',c_crop,g_north_west/' +
      'e_distort:0:0:' + portion + ':0:' + (portion - stripe) + ':' + stageH + ':' + stripe + ':' + stageH + '/' +
      'c_pad,h_2.0,w_1.0/l_radial,e_displace,y_' + distortion + '/e_trim/u_mugright/w_0.7';
    right = addImageFilter(urlImage, filters);


    $('.original').attr('src', original);
    $('.left').attr('src', left);
    $('.center').attr('src', center);
    $('.right').attr('src', right);

  };

  $('.save-btn').click(lel);

  canvas.on({
    'mouse:up': updateControls,
    'object:resizing': updateControls
  });
};
