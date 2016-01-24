/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.RestClientManager = function () {
    APP.RestClientManager.instance = this;
};

APP.RestClientManager.prototype = Object.create(Object.prototype);

APP.RestClientManager.constructor = APP.RestClientManager;

APP.RestClientManager.prototype.execute = function (config) {
    config.method = config.method || 'post';
    return $.ajax(config);
};