/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.BaseNavigation = function () {
  this.currentPage = 0;
  this.totalPages = null;

  this.pagesCache = {};
  this.currentPageData;
  this.listeners();

  this.needChangeUrl = false;
};

APP.BaseNavigation.constructor = APP.BaseNavigation;
APP.BaseNavigation.prototype = Object.create(EventDispatcher.prototype);

APP.BaseNavigation.prototype.start = function(){
}

APP.BaseNavigation.prototype.listeners = function() {

};

APP.BaseNavigation.prototype.suspend = function() {
};

APP.BaseNavigation.prototype.restart = function() {
};

APP.BaseNavigation.prototype.gotoPage = function (next, force) {
  var nextPage = next || this.currentPage + 1;
  if(!force) {
    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;
  }

  if (this.totalPages) {
    if (nextPage > this.totalPages) return;
  }

  this.dispatchEvent({type: Events.LOAD_START});

  this.newPageUrl(nextPage);

  if (this.pagesCache[nextPage] && !force)
    return this.afterGetData(this.pagesCache[nextPage]);

  Utils.getData({url: DataApp.currentUrl}).done(this.afterGetData.bind(this));
};

APP.BaseNavigation.prototype.afterGetData = function (response) {
  this.currentPage = response.pagination.page;
  this.totalPages = response.pagination.pages;    
  // }, APP.Share.postToTwitter = function (a) {
  //   var b = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(a.text);
  //   a.link && (b += "&url=" + encodeURIComponent(a.link)), window.open(b, "_blank", "height=300,width=550,resizable=1")
  // }
  // if (this.currentPage > response.pagination.pages)return;

  this.pagesCache[this.currentPage] = response;
  this.currentPageData = response;
  // if(this.needChangeUrl) {
  //   Utils.changeUrl(DataApp.baseTitle, response.url);
  // }
  this.dispatchEvent({type: Events.LOAD_END, data: response});
};

APP.BaseNavigation.prototype.newPageUrl = function (newPage) {
  console.log(DataApp.currentUrl);
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
