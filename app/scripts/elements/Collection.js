/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Collection = function (data, options) {
    APP.BaseElement.call(this, data, 'collection', options);
};

APP.Collection.prototype = Object.create(APP.BaseElement.prototype);

APP.Collection.constructor = APP.Collection;
