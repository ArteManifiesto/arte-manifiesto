/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.User = function (data) {
    //APP.BaseElement.call(this, data, 'user');
    this.following = this.data.following;
    this.likes = this.data.likes;


};

//APP.User.prototype = Object.create(APP.BaseElement.prototype);

APP.User.constructor = APP.User;

APP.User.prototype.setupUI = function () {
};

APP.User.prototype.listeners = function () {

};
