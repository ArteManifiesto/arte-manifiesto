/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminOrdersScreen = function() {
  APP.BaseScreen.call(this, 'adminOrders');
};

APP.AdminOrdersScreen.constructor = APP.AdminOrdersScreen;
APP.AdminOrdersScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminOrdersScreen.prototype.setupUI = function() {
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

  for(i in data.items){
    data.items[i].data = JSON.parse(data.items[i].data);
    switch (data.items[i].shipping) {
      case 1:
        data.items[i].shipping = '(1) Recibido';
        break;
      case 2:
        data.items[i].shipping = '(2) Producido';
        break;
      case 3:
        data.items[i].shipping = '(3) Enviado a courrier';
        break;
      case 4:
        data.items[i].shipping = '(4) Entregado a cliente';
        break;
    }
  }

  this.viewer = new APP.Viewer('tableProduct', $('.container-items'), 'infinite', data, {
    getTotal: function(total) {
      $('.total').text('(' + total + ')');
    }
  });

  this.searchBox = $('.search-box');
};

APP.AdminOrdersScreen.prototype.listeners = function() {
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

APP.AdminOrdersScreen.prototype.startDateChange = function(event) {
  this.startValue = event.date;
};

APP.AdminOrdersScreen.prototype.endDateChange = function(event) {
  this.endValue = event.date;
};

APP.AdminOrdersScreen.prototype.dropdownChange = function(event) {
  var text = $(event.target).text();

  $(".btn-drop .property").text(text);
  $(".btn-drop .property").val(text);

  switch (text) {
    case 'estado':
      this.term = 'shipping';
      break;
  }
};
APP.AdminOrdersScreen.prototype.searchHander = function() {
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
  
  location.reload();
};