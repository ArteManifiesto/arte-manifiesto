/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, navigation, initialData) {
  this.navigationManager = new APP.NavigationManager(navigation);
  this.listeners();

  for(var i=0; i< initialData.length; i++) {
    $('.grid').append($(APP.TemplateManager.instance.getFromDoc('work-item')(initialData[i])));
  }
};

APP.Viewer.constructor = APP.Viewer;

APP.Viewer.prototype.listeners = function() {
  //Broadcaster.listen('PAGE_CHANGED', this.pageChangedHandler.bind(this));
  //Broadcaster.listen('PAGE_DATA_START', this.pageDataStartHandler.bind(this));
  //Broadcaster.listen('PAGE_DATA_END', this.pageDataEndHandler.bind(this));
};

APP.Viewer.prototype.pageChangedHandler = function() {

};

APP.Viewer.prototype.pageDataStartHandler = function() {

};

APP.Viewer.prototype.pageDataEndHandler = function() {

};

APP.Viewer.prototype.addItems = function() {

};

APP.Viewer.prototype.reset = function() {

};

APP.Viewer.prototype.clean = function() {

};
