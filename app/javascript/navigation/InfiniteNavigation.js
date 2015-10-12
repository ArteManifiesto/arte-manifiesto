/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.InfiniteNavigation = function () {
  APP.BaseNavigation.call(this);
    this.listeners();
};

APP.InfiniteNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.InfiniteNavigation.constructor = APP.InfiniteNavigation;

APP.InfiniteNavigation.prototype.listeners = function() {
  $(window).scroll(this.scrollHandler.bind(this));
};

APP.InfiniteNavigation.prototype.scrollHandler = function() {
  if($(window).scrollTop() == $(document).height() - $(window).height()){
    this.gotoPage(this.currentPage + 1);
  }
}
