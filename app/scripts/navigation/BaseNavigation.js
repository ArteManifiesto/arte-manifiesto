/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.BaseNavigation = function () {
  this.currentPage = 0;
  this.totalPages = 0;

  this.pagesCache = {};
  this.currentPageData;
  this.listeners();
};

APP.BaseNavigation.constructor = APP.BaseNavigation;

APP.BaseNavigation.prototype.start = function(){
}

APP.BaseNavigation.prototype.listeners = function() {

};

APP.BaseNavigation.prototype.gotoPage = function (next, force) {
  var nextPage = next || this.currentPage + 1;
  if(!force) {
    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;
  }

  this.newPageUrl(nextPage);

  if (this.pagesCache[nextPage] && !force)
    return this.afterGetData(this.pagesCache[nextPage]);

  Utils.getData({url: DataApp.currentUrl}).done(this.afterGetData.bind(this));
};

APP.BaseNavigation.prototype.afterGetData = function (response) {
  console.log('response :', response);
  this.currentPage = response.pagination.page;
  this.totalPages = response.pagination.pages;

  if (this.currentPage > response.pagination.pages)return;

  this.pagesCache[this.currentPage] = response;
  this.currentPageData = response;
  ChangeUrl('lol', response.url);

  Broadcaster.dispatchEvent("PAGE_LOAD_END", {data: response});
};

APP.BaseNavigation.prototype.newPageUrl = function (newPage) {
  DataApp.currentUrl = DataApp.currentUrl.replace(/\/$/g, '');
  if(DataApp.currentUrl.indexOf('/page-') === -1)
    DataApp.currentUrl += '/page-'  + this.currentPage;
  DataApp.currentUrl = DataApp.currentUrl.replace('page-' + this.currentPage, 'page-' + newPage);
};

APP.BaseNavigation.prototype.updateUrl = function () {
};

APP.BaseNavigation.prototype.reset = function () {
  this.currentPageData = null;
  this.gotoPage(1, true);
};
