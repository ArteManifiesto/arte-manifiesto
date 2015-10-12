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
  this.view.click(this.gotoSingle.bind(this));
};
