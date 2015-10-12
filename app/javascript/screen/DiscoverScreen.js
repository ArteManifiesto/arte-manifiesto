/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, navigation, iData, filters) {
    this.viewer =  new APP.Viewer(id, navigation, iData);
    this.filters =  new APP.Filters(filters);
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;
