/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TableUser = function (data, options) {
    APP.BaseElement.call(this, data, 'table-user', options);
};

APP.TableUser.prototype = Object.create(APP.BaseElement.prototype);

APP.TableUser.constructor = APP.TableUser;

APP.TableUser.prototype.listeners = function () {
  this.featuredBtn = this.view.find('.featured-btn');
  this.featuredBtn.click(this.featuredHandler.bind(this));
};
