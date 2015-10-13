/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.NavigationManager = function (navigation) {
  this.navigator;
  switch(navigation) {
    case APP.NavigationManager.PAGINATION:
      this.navigator = new APP.PaginationNavigation();
    break;
    case APP.NavigationManager.INFINITE:
    default:
      this.navigator = new APP.InfiniteNavigation();
    break;
  }
};
APP.NavigationManager.NAVIGATION_INFINITE = 'infinite';
APP.NavigationManager.NAVIGATION_PAGINATION = 'pagination';

APP.NavigationManager.prototype = Object.create(Object.prototype);

APP.NavigationManager.constructor = APP.NavigationManager;
