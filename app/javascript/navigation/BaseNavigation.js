/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseNavigation = function () {
  this.currentPage = 0;
  this.totalPages = 0;
  this.urlData;
};

APP.BaseNavigation.constructor = APP.BaseNavigation;

APP.BaseNavigation.prototype.newPageUrl = function (newPage) {
  return DataApp.currentUrl.replace('page-' + this.currentPage, 'page-' + newPage);
};

APP.BaseNavigation.prototype.updateUrl = function () {
};
