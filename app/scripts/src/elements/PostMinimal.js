/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PostMinimal = function(data, options) {
  APP.BaseElement.call(this, data, 'post-minimal', options);
};

APP.PostMinimal.prototype = Object.create(APP.BaseElement.prototype);

APP.PostMinimal.constructor = APP.PostMinimal;