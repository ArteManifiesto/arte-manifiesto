/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseScreen = function (id) {
    this.id = id;
};

APP.BaseScreen.prototype = Object.create(Object.prototype);

APP.BaseScreen.constructor = APP.BaseScreen;

APP.BaseScreen.prototype.listeners = function () {

};

APP.BaseScreen.prototype.beforeFind = function () {

};

APP.BaseScreen.prototype.afterFind = function () {

};

APP.BaseScreen.prototype.clean = function () {

};

APP.BaseScreen.prototype.getData = function (params) {
    return APP.RestClientManager.instance.execute(params);
};
