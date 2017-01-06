/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminOrderSendScreen = function() {
  APP.BaseScreen.call(this, 'adminEditBanner');
};

APP.AdminOrderSendScreen.constructor = APP.AdminOrderSendScreen;
APP.AdminOrderSendScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminOrderSendScreen.prototype.setupUI = function() {
  this.createdBtn = $('.btn-created');
  this.sendedBtn = $('.btn-sended');
  this.deliveredBtn = $('.btn-delivered')
};

APP.AdminOrderSendScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.createdBtn.click(this.updHandler.bind(this, 2));
  this.sendedBtn.click(this.updHandler.bind(this, 3));
  this.deliveredBtn.click(this.updHandler.bind(this, 4));
};

APP.AdminOrderSendScreen.prototype.orderUpdateComplete = function(response) {
  this.showFlash('succes', 'Se actualizo el estado de la orden');
  setTimeout(function() {
    window.location.href = '/report/orders/page-1';
  }, 1000);
};

APP.AdminOrderSendScreen.prototype.updHandler = function(message, e) {
  e.preventDefault();
  var data = {
    idOrder: order.id,
    shipping: message
  };
  var url = '/report/orders/update';
  this.requestHandler(url, data, this.orderUpdateComplete);
};