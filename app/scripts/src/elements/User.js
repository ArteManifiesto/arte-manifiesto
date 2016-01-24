/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.User = function (data, options) {
    APP.BaseElement.call(this, data, 'user', options);
};

APP.User.prototype = Object.create(APP.BaseElement.prototype);

APP.User.constructor = APP.User;

APP.User.prototype.listeners = function () {
  APP.BaseElement.prototype.listeners.call(this);
  this.view.find('.am-Follow-button').click(this.followHandler.bind(this));
};

APP.User.prototype.followHandler = function() {
  if(this.isLogged()) {
    var action = this.data.following ? 'unfollow' : 'follow';
    var options = {
      url: DataApp.currentUser.url + '/' + action,
      data: {idUser: this.data.id}
    };
    Utils.getData(options).then(this.followHandlerComplete.bind(this));
  }
};

APP.User.prototype.followHandlerComplete = function(response) {
  if(response.status === 200) {
    if(this.data.following){
      this.view.find('.am-Follow-button').removeClass('following').text('+Seguir');
    }else {
      this.view.find('.am-Follow-button').addClass('following').text('Siguiendo');
    }
    this.data.following = !this.data.following;
  }
};
