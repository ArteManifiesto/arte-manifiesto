/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CarrouselItem = function(data, options) {
  options = options || {};
  if(!options.worked) options.worked = false;
  
  APP.BaseElement.call(this, data, 'carrousel-item', options);
};

APP.CarrouselItem.prototype = Object.create(APP.BaseElement.prototype);

APP.CarrouselItem.constructor = APP.CarrouselItem;
