/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminProductsApplyingScreen = function () {
  APP.BaseScreen.call(this, 'adminProductsApplying');
};

APP.AdminProductsApplyingScreen.constructor = APP.AdminProductsApplyingScreen;
APP.AdminProductsApplyingScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminProductsApplyingScreen.prototype.setupUI = function () {
  this.searchBtn = $('.search-btn');
  this.start = $('.start');
  this.end = $('.end');

  this.startValue = null;
  this.endValue = null;

  if (Utils.getUrlParameter('start')) {
    var startParam = Utils.getUrlParameter('start');
    this.startValue = new Date(startParam);
    this.start.find('input').val(startParam.replace(/-/gi, '/'));
  }

  if (Utils.getUrlParameter('end')) {
    var endParam = Utils.getUrlParameter('end');
    this.endValue = new Date(endParam);
    this.end.find('input').val(endParam.replace(/-/gi, '/'));
  }

  this.viewer = new APP.Viewer('tableProductApplying', $('.container-items'), 'infinite', data, {
    getTotal: function (total) {
      $('.total').text('(' + total + ')');
    }
  });

  this.searchBox = $('.search-box');
};

APP.AdminProductsApplyingScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.start.datepicker().on('changeDate', this.startDateChange.bind(this));
  this.end.datepicker().on('changeDate', this.endDateChange.bind(this));
  this.searchBtn.click(this.searchHander.bind(this));
};

APP.AdminProductsApplyingScreen.prototype.startDateChange = function (event) {
  this.startValue = event.date;
};

APP.AdminProductsApplyingScreen.prototype.endDateChange = function (event) {
  this.endValue = event.date;
};

APP.AdminProductsApplyingScreen.prototype.searchHander = function () {
  if (this.startValue) {
    if (!this.endValue)
      return this.showFlash('error', ['Ingresa una fecha de fin']);

    var startStr = (this.startValue.getMonth() + 1 ) + "-" +
      this.startValue.getDate() + "-" +
      this.startValue.getFullYear();

    DataApp.currentUrl = Utils.updateQueryStringParameter(DataApp.currentUrl, 'start', startStr);
  } else {
    DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'start');
  }

  if (this.endValue) {
    if (!this.startValue)
      return this.showFlash('error', ['Ingresa una fecha de inicio']);

    var endStr = (this.endValue.getMonth() + 1) + "-" +
      this.endValue.getDate() + "-" +
      this.endValue.getFullYear();

    DataApp.currentUrl = Utils.updateQueryStringParameter(DataApp.currentUrl, 'end', endStr);
  } else {
    DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'end');
  }

  if (DataApp.currentUrl === window.location.href) return;

  Utils.changeUrl(this.id, DataApp.currentUrl);
  this.viewer.reset();
};
