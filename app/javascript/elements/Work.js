/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Work = function (data) {
    APP.BaseElement.call(this, data, 'work');
};

APP.Work.prototype = Object.create(APP.BaseElement.prototype);

APP.Work.constructor = APP.Work;

APP.Work.prototype.listeners = function () {
  this.view.click(this.gotoSingle.bind(this));
};
