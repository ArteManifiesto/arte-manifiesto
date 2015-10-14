/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.User = function (data) {
    APP.BaseElement.call(this, data, 'user');
};

APP.User.prototype = Object.create(APP.BaseElement.prototype);

APP.User.constructor = APP.User;

APP.User.prototype.listeners = function () {
  this.view.find('.am-Follow-button').click(this.followHandler.bind(this));
};

APP.User.prototype.followHandler = function() {
  if(this.isLogged()) {
    var action = this.data.following ? 'unfollow' : 'follow';
    var options = {
      url: DataApp.currentUser.url + action,
      data: {idUser: this.data.id}
    };
    Utils.getData(options).then(this.followHandlerComplete);
  }
};

APP.User.prototype.followHandlerComplete = function(response) {
  console.log(response);
};
