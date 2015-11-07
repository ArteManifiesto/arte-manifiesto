/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.InfiniteNavigation = function () {
  APP.BaseNavigation.call(this);
};

APP.InfiniteNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.InfiniteNavigation.constructor = APP.InfiniteNavigation;

APP.InfiniteNavigation.prototype.listeners = function() {
  this.scrollHandler = this.scrollHandler.bind(this);
  $(window).scroll(this.scrollHandler);
};

APP.InfiniteNavigation.prototype.scrollHandler = function() {
  if($(window).scrollTop() == $(document).height() - $(window).height()){
    this.gotoPage(this.currentPage + 1);
  }
}

APP.InfiniteNavigation.prototype.suspend = function() {
  $(window).off("scroll", this.scrollHandler);
}

APP.InfiniteNavigation.prototype.restart = function() {
  $(window).on("scroll", this.scrollHandler);
}
