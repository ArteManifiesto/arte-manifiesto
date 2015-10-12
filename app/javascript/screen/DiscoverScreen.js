/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, navigation, data) {
    this.viewer =  new APP.Viewer(id, navigation, data);
    this.filters =  new APP.Filters(data.filters);
    this.listeners();
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;

APP.DiscoverScreen.prototype.listeners = function() {
  Broadcaster.addEventListener('PAGE_RESET', this.pageResetHandler.bind(this));
};

APP.DiscoverScreen.prototype.pageResetHandler = function() {
  this.viewer.reset();
};
