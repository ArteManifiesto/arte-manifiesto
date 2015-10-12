/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, navigation, data) {
  this.navigationManager = new APP.NavigationManager(navigation);
  this.navigationManager.navigator.currentPage = data.pagination.page;
  this.navigationManager.navigator.totalPages = data.pagination.pages;
  this.listeners();

  this.addItems(data);
};

APP.Viewer.constructor = APP.Viewer;

APP.Viewer.prototype.listeners = function() {
  Broadcaster.addEventListener('PAGE_LOAD_START', this.pageLoadStartHandler);
  Broadcaster.addEventListener('PAGE_LOAD_END', this.pageLoadEndHandler.bind(this));
};

APP.Viewer.prototype.pageLoadStartHandler = function() {

};

APP.Viewer.prototype.pageLoadEndHandler = function(event) {
  this.addItems(event.data, true);
};

APP.Viewer.prototype.addItems = function(data, initialized) {
  var i = 0, item, items = data.items;
  for(i; i< items.length; i++) {
    item = new APP.Work(items[i]);
    if(!initialized)
      $('.grid').append(item.view)
    else
      $('.grid').append(item.view).masonry('appended', item.view);
  }
};

APP.Viewer.prototype.reset = function() {
  this.navigationManager.navigator.reset();
};

APP.Viewer.prototype.clean = function() {

};
