/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseScreen = function(id) {
  this.id = id;

  this.setupUI();
  this.listeners();
};

APP.BaseScreen.prototype = Object.create(Object.prototype);

APP.BaseScreen.constructor = APP.BaseScreen;
APP.BaseScreen.prototype.setupUI = function() {};

APP.BaseScreen.prototype.listeners = function() {};

APP.BaseScreen.prototype.requestHandler = function(url, payload, next, error, free) {
  !free && Utils.checkAuthentication();
  $.post(url, payload).then(this.requestComplete.bind(this, next, error));
};

APP.BaseScreen.prototype.requestComplete = function(next, error, response) {
  console.log('response ===>', response);
  if (response.status !== 200) {
    var errors = response.data.errors || ['Parece que algo fallo, por favor refresca la página'];
    error && error.bind(this)();
    return this.showFlash('error', errors);
  }
  next.bind(this)(response);
};

APP.BaseScreen.prototype.showFlash = function(meta, data) {
  var element = $('.' + meta);
  $('.flash-message').css('visibility', 'hidden');
  var container = element.find('.content-text');
  container.empty();
  if (meta === 'error') {
    for (var i = 0; i < data.length; i++) {
      container.append($('<p>').text('✘ ' + data[i]));
    }
  } else {
    container.text(data);
  }
  element.css('visibility', 'visible');
  element.removeClass('fadeIn');
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    element.addClass('fadeIn');
  }, 100);
};

APP.BaseScreen.prototype.getTemplate = function(path) {
  var temp = '';
  if (['followings', 'followers'].indexOf(path) !== -1) temp = 'user';
  if ('portfolio' === path) temp = 'work';
  if ('products' === path) temp = 'product';
  if ('collections' === path) temp = 'collection';
  return temp;
};

APP.BaseScreen.prototype.clean = function() {

};