/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.RequestItem = function (data, options) {
    APP.BaseElement.call(this, data, 'request-item', options);

    var scope = this;
    var step1 = this.view.find('.step-1');
    var step2 = this.view.find('.step-2');
    var step3 = this.view.find('.step-3');
    var step4 = this.view.find('.step-4');
    var step5 = this.view.find('.step-5');

    if(this.data.status === 'recibido') {
      step1.removeClass('hide');
    }

    step1.find('.yes').click(function(e) {
      e.preventDefault();
      step1.addClass('hide');
      step2.removeClass('hide');
    });

    step1.find('.no').click(function(e) {
      e.preventDefault();
    });

    step2.find('.done').click(function(e) {
      e.preventDefault();
      step2.addClass('hide');
      step3.removeClass('hide');
    });

    step3.find('.done').click(function(e) {
      e.preventDefault();
      step3.addClass('hide');
      step4.removeClass('hide');
    });

    step4.find('.upload').click(function() {
      step4.addClass('hide');
      step5.removeClass('hide');
    });
};

APP.RequestItem.prototype = Object.create(APP.BaseElement.prototype);

APP.RequestItem.constructor = APP.RequestItem;
