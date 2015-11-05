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

function ChangeUrl(page, url) {
       if (typeof (history.pushState) != "undefined") {
           var obj = {Page: page, Url: url};
           history.pushState(obj, obj.Page, obj.Url);
       } else {
           window.location.href = "homePage";
           // alert("Browser does not support HTML5.");
       }
   }

APP.DiscoverScreen.prototype.filterChangedHandler = function(event) {
  ChangeUrl('lol', DataApp.currentUrl);
  this.viewer.reset();
};
