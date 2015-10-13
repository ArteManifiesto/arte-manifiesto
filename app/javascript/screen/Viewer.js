/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, navigation, data, container) {
  this.id = id;
  this.navigation = navigation;
  this.initialize = true;
  if(this.navigation) {
    this.navigationManager = new APP.NavigationManager(navigation);
    this.navigationManager.navigator.currentPage = data.pagination.page;
    this.navigationManager.navigator.totalPages = data.pagination.pages;
    this.navigationManager.navigator.start();
    this.listeners();
    this.addItems(data.items);
  }else {
    this.addItems(data, container);
  }
};

APP.Viewer.constructor = APP.Viewer;

APP.Viewer.prototype.listeners = function() {
  Broadcaster.addEventListener('PAGE_LOAD_START', this.pageLoadStartHandler);
  Broadcaster.addEventListener('PAGE_LOAD_END', this.pageLoadEndHandler.bind(this));
};

APP.Viewer.prototype.pageLoadStartHandler = function() {

};

APP.Viewer.prototype.pageLoadEndHandler = function(event) {
  this.initialize = false;
  this.addItems(event.data.items);
};
APP.Viewer.prototype.addItems = function(items, container) {
  if(this.navigation === APP.NavigationManager.NAVIGATION_PAGINATION && !this.initialize) {
      this.clean();
  }
  var i = 0, item;
  for(i; i< items.length; i++) {
    item = new APP[Utils.capitalize(this.id)](items[i]);
    if(this.navigation) {
      if(this.initialize) {
        $('.grid').append(item.view);
      }
      else {
        $('.grid').append(item.view).masonry('appended', item.view);
      }
    }else {
      container.append(item.view);
    }
  }
};

APP.Viewer.prototype.reset = function() {
  this.clean();
  this.navigationManager.navigator.reset();
};
APP.Viewer.prototype.clean = function() {
    var container = $('.grid');
    container.masonry('remove', container.find('.grid-item')).masonry();
    this.initialize = false;
}
