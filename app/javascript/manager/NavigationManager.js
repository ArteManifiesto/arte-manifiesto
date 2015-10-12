/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.NavigationManager = function (navigation) {
  APP.NavigationManager.NAVIGATION_INFINITE = 'infinite';
  APP.NavigationManager.NAVIGATION_PAGINATION = 'pagination';

  this.navigator;
  switch(navigation) {
    case APP.NavigationManager.NAVIGATION_PAGINATION:
      this.navigator = new APP.PaginableNavigation();
    break;
    case APP.NavigationManager.NAVIGATION_INFINITE:
    default:
      this.navigator = new APP.InfiniteNavigation();
    break;
  }
};

APP.NavigationManager.prototype = Object.create(Object.prototype);

APP.NavigationManager.constructor = APP.NavigationManager;
