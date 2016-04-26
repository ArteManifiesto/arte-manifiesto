/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Work = function(data, options) {
  APP.BaseElement.call(this, data, 'work', options);
};

APP.Work.prototype = Object.create(APP.BaseElement.prototype);

APP.Work.constructor = APP.Work;


APP.Work.prototype.listeners = function() {
  APP.BaseElement.prototype.listeners.call(this);
  this.view.find('.delete-new').click(this.deleteHandler.bind(this));
  this.view.find('.delete-force').click(this.deleteForceHandler.bind(this));
  this.view.find('.cancel').click(this.cancelHandler.bind(this));
  this.view.find('.edit').click(this.editHandler.bind(this));
  this.view.find('.settings-btn').click(this.settingsHandler.bind(this));
};

APP.Work.prototype.settingsHandler = function() {
  if (this.view.find('.menu-settings').hasClass('hide')) {
    this.view.find('.menu-settings').removeClass('hide');
  } else {
    this.view.find('.menu-settings').addClass('hide');
  }
};

APP.Work.prototype.deleteHandler = function(e) {
  e.preventDefault();
  this.view.find('.menu-settings').addClass('hide');
  this.view.find('.delete-confirm').show();
};

APP.Work.prototype.deleteForceHandler = function() {
  if (this.options.context === 'single-collection') {
    var url = '/user/' + this.data.User.username + '/work/remove_from_collection';
    var scope = this;
    $.post(url, {
      idWork: this.data.id,
      idCollection: collection.id
    }, function(response) {
      if (response.status === 200)
        $(scope.view.parent()).masonry('remove', scope.view).masonry();
    });
  } else {
    var url = '/user/' + this.data.User.username + '/work/delete';
    var scope = this;
    $.post(url, {
      idWork: this.data.id
    }, function(response) {
      if (response.status === 200)
        $(scope.view.parent()).masonry('remove', scope.view).masonry();
    });
  }
};

APP.Work.prototype.cancelHandler = function() {
  this.view.find('.delete-confirm').hide();
};


APP.Work.prototype.editHandler = function() {
  location.href = '/user/' + this.data.User.username + '/work/' + this.data.nameSlugify + '/edit';
};