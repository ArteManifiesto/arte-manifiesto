/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Post = function(data, options) {
  APP.BaseElement.call(this, data, 'post', options);
};

APP.Post.prototype = Object.create(APP.BaseElement.prototype);

APP.Post.constructor = APP.Post;