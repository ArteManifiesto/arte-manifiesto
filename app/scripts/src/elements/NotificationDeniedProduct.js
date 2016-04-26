/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.NotificationDeniedProduct = function(data, options) {
  data.data = JSON.parse(data.data);
  APP.BaseElement.call(this, data, 'notification-denied-product', options);
};

APP.NotificationDeniedProduct.prototype = Object.create(APP.BaseElement.prototype);

APP.NotificationDeniedProduct.constructor = APP.NotificationDeniedProduct;