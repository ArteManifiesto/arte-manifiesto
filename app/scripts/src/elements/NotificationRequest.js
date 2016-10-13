/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.NotificationRequest = function(data, options) {
  APP.BaseElement.call(this, data, 'notification-request', options);
};

APP.NotificationRequest.prototype = Object.create(APP.BaseElement.prototype);

APP.NotificationRequest.constructor = APP.NotificationRequest;