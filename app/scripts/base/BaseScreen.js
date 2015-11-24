/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseScreen = function (id) {
  this.id = id;
  this.listeners();
};

APP.BaseScreen.prototype = Object.create(Object.prototype);

APP.BaseScreen.constructor = APP.BaseScreen;

APP.BaseScreen.prototype.listeners = function () {

};

APP.BaseScreen.prototype.requestHandler = function(url, payload, next) {
  Utils.checkAuthentication();
  next = next.bind(this);
  $.post(url, payload).then(function(response) {
    if(response.status !== 200)
      return this.showFlash('error', ['Algo sucedió mal']);
    next(response);
  });
}

APP.BaseScreen.prototype.showFlash = function(meta , data) {
  var element = $('.' + meta);
  $('.flash-message').css('visibility', 'hidden');
  var container = element.find('.content-text');
  container.empty();
  if(meta === 'error') {
    for (var i = 0; i < data.length; i++) {
      container.append($('<p>').text('✘ ' + data[i]));
    }
  } else {
    container.text(data);
  }
  element.css('visibility', 'visible');
  element.removeClass('fadeIn');
  element.addClass('fadeIn');
};

APP.BaseScreen.prototype.getTemplate = function (path) {
  var temp = '';
  if (['followings', 'followers'].indexOf(path) !== -1) temp = 'user';
  if ('portfolio' === path) temp = 'work';
  if ('store' === path) temp = 'product';
  if ('collections' === path) temp = 'collection';
  return temp;
};

APP.BaseScreen.prototype.clean = function () {

};
