/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Collection = function (data) {
    APP.BaseElement.call(this, data, 'collection');
};

APP.Collection.prototype = Object.create(APP.BaseElement.prototype);

APP.Collection.constructor = APP.Collection;

APP.Collection.prototype.listeners = function () {
  this.view.click(this.gotoSingle.bind(this));
};
