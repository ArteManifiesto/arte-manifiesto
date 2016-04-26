/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Review = function(data, options) {
  APP.BaseElement.call(this, data, 'review', options);
};

APP.Review.prototype = Object.create(APP.BaseElement.prototype);

APP.Review.constructor = APP.Review;