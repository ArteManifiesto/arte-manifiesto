/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.InfiniteNavigation = function () {
  APP.BaseNavigation.call(this);
  this.counter = 0;
};

APP.InfiniteNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.InfiniteNavigation.constructor = APP.InfiniteNavigation;

APP.InfiniteNavigation.prototype.listeners = function() {
  this.scrollHandler = this.scrollHandler.bind(this);
  $(window).on("scroll", this.scrollHandler);

};

APP.InfiniteNavigation.prototype.scrollHandler = function() {
  if($(window).scrollTop() >= ($(document).height() - $(window).height() - $('.am-Footer').height())) {
    ++this.counter;
    if(this.counter === 1) {
      this.suspend();
      this.gotoPage(this.currentPage + 1);
    }
  }
}

APP.InfiniteNavigation.prototype.suspend = function() {
  $(window).off("scroll", this.scrollHandler);
}

APP.InfiniteNavigation.prototype.restart = function() {
  this.counter = 0;
  $(window).on("scroll", this.scrollHandler);
}
