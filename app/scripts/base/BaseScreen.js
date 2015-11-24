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
  $.post(url, payload).then(function(response) {
    if(response.status !== 200)
      return this.showFlashMessage();
    next(response);
  });
}

APP.BaseScreen.prototype.showFlashMessage = function() {

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
