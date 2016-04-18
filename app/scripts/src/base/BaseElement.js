/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.BaseElement = function(data, id, options) {
  this.options = options || {
    context: 'normal'
  };
  this.template = APP.TemplateManager.instance.getFromDoc(id);
  this.data = data;
  this.id = id;
  var viewHelpers = {
    addFilter: Utils.addImageFilter,
    formatDate: function(date) {
      return moment(date).fromNow();
    },
    viewer: DataApp.currentUser
  };
  _.extend(this.data, this.options);
  _.extend(this.data, viewHelpers);
  this.view = $(this.template(this.data));
  this.rawView = this.view[0];
  this.listeners();
};

APP.BaseElement.prototype = Object.create(EventDispatcher.prototype);

APP.BaseElement.constructor = APP.BaseElement;

APP.BaseElement.prototype.listeners = function() {
  this.featuredBtn = this.view.find('.featured');
  this.featuredBtn.click(this.featuredHandler.bind(this));
};

APP.BaseElement.prototype.featuredHandler = function() {
  var url, tempId = this.id;
  if (this.id === 'table-work') tempId = 'work';
  if (this.id === 'table-user') tempId = 'user';

  if (this.data.featured) {
    if (tempId === 'user') {
      url = '/user/' + this.data.username + '/unfeatured';
    } else {
      url = '/user/' + this.data.User.username + '/' + tempId + '/unfeatured';
    }
  } else {
    if (tempId === 'user') {
      url = '/user/' + this.data.username + '/featured';
    } else {
      url = '/user/' + this.data.User.username + '/' + tempId + '/featured';
    }
  }
  var scope = this,
    payload = {};
  payload['id' + Utils.capitalize(tempId)] = this.data.id;
  $.post(url, payload, function(response) {
    if (response.status === 200) {
      if (response.data[tempId].featured) {
        if (scope.id.indexOf('table') > -1)
          scope.featuredBtn.removeClass('btn-default').addClass('btn-primary');
        else
          scope.featuredBtn.removeClass('disabled');
      } else {
        if (scope.id.indexOf('table') > -1)
          scope.featuredBtn.removeClass('btn-primary').addClass('btn-default');
        else
          scope.featuredBtn.addClass('disabled');
      }
      scope.data.featured = response.data[tempId].featured;
    }
  });
};

APP.BaseElement.prototype.callToApi = function(params) {
  return APP.RestClientManager.instance.execute(params);
}

APP.BaseElement.prototype.isLogged = function() {
  Utils.checkAuthentication();
  return DataApp.currentUser !== null;
};