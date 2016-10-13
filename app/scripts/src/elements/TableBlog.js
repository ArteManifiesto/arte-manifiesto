/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TableBlog = function(data, options) {
  APP.BaseElement.call(this, data, 'table-blog', options);
};

APP.TableBlog.prototype = Object.create(APP.BaseElement.prototype);

APP.TableBlog.constructor = APP.TableBlog;