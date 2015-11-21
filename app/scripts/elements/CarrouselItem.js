/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CarrouselItem = function (data) {
      APP.BaseElement.call(this, data, 'carrouselItem');
};

APP.CarrouselItem.prototype = Object.create(APP.BaseElement.prototype);

APP.CarrouselItem.constructor = APP.CarrouselItem;
