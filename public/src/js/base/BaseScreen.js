/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseScreen = function () {

};

APP.BaseScreen.prototype = Object.create(Object.prototype);

APP.BaseScreen.constructor = APP.BaseScreen;

APP.BaseScreen.prototype.beforeFind = function () {

}

APP.BaseScreen.prototype.afterFind = function () {

}

APP.BaseScreen.prototype.getDataByAjax = function (config, method, callback) {
    APP.RestClientManager.instance.execute(config, method, callback);
}