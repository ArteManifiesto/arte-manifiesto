/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, container, navigation, data) {
  this.container = container;
  this.navigation = navigation;
  this.data = data;
  APP.BaseScreen.call(this, id);
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;
APP.DiscoverScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.DiscoverScreen.prototype.setupUI = function () {
  DataApp.currentUrl = this.data.url;
  Utils.changeUrl(this.id, this.data.url);

  this.searchText = $('.search-text');
  this.featuredText = $('.featured-text');

  this.viewer = new APP.Viewer(this.id, this.container, this.navigation, this.data);
  this.filters = new APP.Filters(this.data.filters);
};

APP.DiscoverScreen.prototype.listeners = function () {
  Broadcaster.addEventListener(Events.FILTER_CHANGED, this.filterChangedHandler.bind(this));
  this.filters.start();
};

APP.DiscoverScreen.prototype.filterChangedHandler = function (event) {

  if (event.meta) $('.' + event.meta + '-text').text(event.newValue);

  if (this.filters.term && this.filters.term.length > 0) {
    this.searchText.show();
    this.searchText.text(decodeURIComponent(this.filters.term));
  } else {
    this.searchText.hide();
    this.searchText.text('');
  }

  if (this.filters.isFeatured) {
    this.featuredText.show();
    this.featuredText.text('AM');
  } else {
    this.featuredText.hide();
    this.featuredText.text('');
  }

  var texts = [], currentText;
  $('.navigation > span').filter(function (index, value) {
    if ($(value).css('display') !== 'none')
      texts.push($(value));
  });

  var i;
  for (i = 0; i < texts.length; i++) {
    if (texts[i].text().indexOf(' >') !== -1)
      texts[i].text(texts[i].text().replace(' >', '')).removeClass('link');
  }

  for (i = 0; i < texts.length - 1; i++) {
    texts[i].text(texts[i].text() + ' >').addClass('link');
  }

  if(DataApp.currentUrl === window.location.href) return;

  Utils.changeUrl(this.id, DataApp.currentUrl);
  if (this.filters.isInitialized) this.viewer.reset();
};
