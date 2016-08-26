/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TableBrand = function(data, options) {
  APP.BaseElement.call(this, data, 'table-brand', options);
};

APP.TableBrand.prototype = Object.create(APP.BaseElement.prototype);

APP.TableBrand.constructor = APP.TableBrand;

APP.TableBrand.prototype.listeners = function() {
};