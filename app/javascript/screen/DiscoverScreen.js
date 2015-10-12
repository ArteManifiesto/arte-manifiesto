/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, navigation, data) {
    this.viewer =  new APP.Viewer(id, navigation, data);
    this.filters =  new APP.Filters(data.filters);
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;
