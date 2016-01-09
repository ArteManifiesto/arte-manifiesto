/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Table = function (data, options) {
    APP.BaseElement.call(this, data, 'table', options);
};

APP.Table.prototype = Object.create(APP.BaseElement.prototype);

APP.Table.constructor = APP.Table;
