/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, container, navigation, data) {
    this.viewer =  new APP.Viewer(id, container, navigation, data);
    this.filters =  new APP.Filters(data.filters);
    this.listeners();
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;

APP.DiscoverScreen.prototype.listeners = function() {
  Broadcaster.addEventListener('FILTER_CHANGED', this.filterChangedHandler.bind(this));
};

APP.DiscoverScreen.prototype.filterChangedHandler = function(event) {
  if(event.meta === 'category')
    $('.am-navigation-text').html(event.newValue);
  this.viewer.reset();
};
