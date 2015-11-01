/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Product = function (data) {
    APP.BaseElement.call(this, data, 'product');
};

APP.Product.prototype = Object.create(APP.BaseElement.prototype);

APP.Product.constructor = APP.Product;

APP.Product.prototype.listeners = function () {
  this.view.click(this.gotoSingle.bind(this));
};
