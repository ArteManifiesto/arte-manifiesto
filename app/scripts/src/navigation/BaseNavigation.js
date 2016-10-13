/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseNavigation = function() {
  this.currentPage = 0;
  this.totalPages = null;

  this.currentPageData;
  this.listeners();

  this.needChangeUrl = false;
  this.ajax = null;
};

APP.BaseNavigation.constructor = APP.BaseNavigation;
APP.BaseNavigation.prototype = Object.create(EventDispatcher.prototype);

APP.BaseNavigation.prototype.start = function() {};

APP.BaseNavigation.prototype.listeners = function() {};

APP.BaseNavigation.prototype.suspend = function() {};

APP.BaseNavigation.prototype.restart = function() {};

APP.BaseNavigation.prototype.gotoPage = function(next, force) {
  var nextPage = next || this.currentPage + 1;
  if (!force) {
    if (this.currentPage === nextPage) return;
    if (this.currentPage === 0) this.currentPage = 1;
  }

  if (this.totalPages) {
    if (nextPage > this.totalPages) return;
  }

  this.dispatchEvent({
    type: Events.LOAD_START
  });

  this.newPageUrl(nextPage);

  this.ajax = Utils.getData({
    url: DataApp.currentUrl
  }).done(this.afterGetData.bind(this));
};

APP.BaseNavigation.prototype.afterGetData = function(response) {
  this.currentPage = response.pagination.page;
  this.totalPages = response.pagination.pages;
  this.currentPageData = response;
  this.dispatchEvent({
    type: Events.LOAD_END,
    data: response
  });
};

APP.BaseNavigation.prototype.newPageUrl = function(newPage) {
  DataApp.currentUrl = DataApp.currentUrl.replace(/\/$/g, '');
  if (DataApp.currentUrl.indexOf('/page-') === -1)
    DataApp.currentUrl += '/page-' + this.currentPage;
  DataApp.currentUrl = DataApp.currentUrl.replace('page-' + this.currentPage, 'page-' + newPage);
  // Utils.changeUrl('', DataApp.currentUrl);
};

APP.BaseNavigation.prototype.reset = function() {
  if (this.ajax) {
    this.ajax.abort();
  }
  this.currentPageData = null;
  this.gotoPage(1, true);
  Utils.changeUrl('', DataApp.currentUrl);
};