/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminWorksScreen = function() {
  APP.BaseScreen.call(this, 'adminWorks');
};

APP.AdminWorksScreen.constructor = APP.AdminWorksScreen;
APP.AdminWorksScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminWorksScreen.prototype.setupUI = function() {
  this.searchBtn = $('.search-btn');
  this.start = $('.start');
  this.end = $('.end');

  this.startValue = null;
  this.endValue = null;

  this.term = null;

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

  this.viewer = new APP.Viewer('tableWork', $('.container-items'), 'infinite', data, {
    getTotal: function(total) {
      $('.total').text('(' + total + ')');
    }
  });

  this.searchBox = $('.search-box');
};

APP.AdminWorksScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.start.datepicker().on('changeDate', this.startDateChange.bind(this));
  this.end.datepicker().on('changeDate', this.endDateChange.bind(this));
  this.searchBtn.click(this.searchHander.bind(this));

  $(".dropdown-menu li a").click(this.dropdownChange.bind(this));

  if (Utils.getUrlParameter('term')) {
    this.term = Utils.getUrlParameter('term');
    $('.' + this.term).click();
  }

  if (Utils.getUrlParameter('termValue')) {
    this.searchBox.val(decodeURI(Utils.getUrlParameter('termValue')));
  }
};

APP.AdminWorksScreen.prototype.startDateChange = function(event) {
  this.startValue = event.date;
};

APP.AdminWorksScreen.prototype.endDateChange = function(event) {
  this.endValue = event.date;
};

APP.AdminWorksScreen.prototype.dropdownChange = function(event) {
  var text = $(event.target).text();

  $(".btn-drop .property").text(text);
  $(".btn-drop .property").val(text);

  switch (text) {
    case 'nombre':
      this.term = 'name';
      break;
    case 'recomendado':
      this.term = 'featured';
      break;
  }
};
APP.AdminWorksScreen.prototype.searchHander = function() {
  var termValue = this.searchBox.val().trim();

  if (this.term && this.term.trim().length > 0) {

    if (this.term === 'featured') {
      if (termValue.length > 0 && isNaN(parseInt(termValue, 10)))
        return this.showFlash('error', ['El valor necesita ser 1 o 0']);
    }

    if (termValue.length > 0) {
      DataApp.currentUrl = Utils.updateQueryStringParameter(DataApp.currentUrl, 'term', this.term);
      DataApp.currentUrl = Utils.updateQueryStringParameter(DataApp.currentUrl, 'termValue', termValue);
    } else {
      DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'term');
      DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'termValue');
    }
  } else {
    DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'term');
    DataApp.currentUrl = Utils.removeURLParameter(DataApp.currentUrl, 'termValue');

    if (termValue.length > 0) {
      return this.showFlash('error', ['Necesitas seleccionar una propiedad']);
    }
  }

  if (this.startValue) {
    if (!this.endValue)
      return this.showFlash('error', ['Ingresa una fecha de fin']);

    var startStr = (this.startValue.getMonth() + 1) + "-" +
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