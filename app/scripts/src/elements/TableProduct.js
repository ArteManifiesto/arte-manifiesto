/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TableProduct = function(data, options) {
  APP.BaseElement.call(this, data, 'table-product', options);
};

APP.TableProduct.prototype = Object.create(APP.BaseElement.prototype);

APP.TableProduct.constructor = APP.TableProduct;

APP.TableProduct.prototype.listeners = function() {
  this.featuredBtn = this.view.find('.featured-btn');
  this.featuredBtn.click(this.featuredHandler.bind(this));
};