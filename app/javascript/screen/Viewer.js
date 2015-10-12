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

  for(var i=0; i< data.items.length; i++) {
    $('.grid').append($(APP.TemplateManager.instance.getFromDoc('work-item')(data.items[i])));
  }
};

APP.Viewer.constructor = APP.Viewer;

APP.Viewer.prototype.listeners = function() {
  Broadcaster.addEventListener('PAGE_LOAD_START', this.pageLoadStartHandler);
  Broadcaster.addEventListener('PAGE_LOAD_END', this.pageLoadEndHandler);
};

APP.Viewer.prototype.pageLoadStartHandler = function() {

};

APP.Viewer.prototype.pageLoadEndHandler = function(event) {
  var items = event.data.items;
  for(var i=0; i< items.length; i++) {
    var item = $(APP.TemplateManager.instance.getFromDoc('work-item')(items[i]));
    $('.grid').append(item).masonry('appended', item);
  }
};

APP.Viewer.prototype.addItems = function() {

};

APP.Viewer.prototype.reset = function() {

};

APP.Viewer.prototype.clean = function() {

};
