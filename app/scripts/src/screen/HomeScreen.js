/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.HomeScreen = function() {
  APP.BaseScreen.call(this, 'home');

  this.usersViewer = new APP.Viewer('user', $('.grid'), null, users);
  this.worksViewer = new APP.Viewer('work', $('.grid-works'), null, works);

  var $banner = $('.banner-user').detach();
  this.usersViewer.container.append($banner).masonry('appended', $banner);


  this.slider = new Slider(document.querySelector('.slider'), {
    slideClass: 'js-slide',
    sliderNavItemClass: 'js-slideNavItem'
  });
};

APP.HomeScreen.constructor = APP.HomeScreen;
APP.HomeScreen.prototype = Object.create(APP.BaseScreen.prototype);