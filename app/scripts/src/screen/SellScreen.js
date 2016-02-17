/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.SellScreen = function () {
  APP.BaseScreen.call(this, 'sell');
};

APP.SellScreen.constructor = APP.SellScreen;
APP.SellScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.SellScreen.prototype.setupUI = function() {
  this.createBtn = $('.create-btn');
};

APP.SellScreen.prototype.listeners = function() {
  this.createBtn.click(this.createHandler.bind(this));
};

APP.SellScreen.prototype.createHandler = function(e) {
  e.preventDefault();

  var url = DataApp.currentUser.url + '/product/create';
  var payload = {
    WorkId: work.id,
    CategoryId: 19,
    finalPrice: '60',
    price: '50',
    name: work.name,
    photo: work.photo,
    description: work.description
  };

  this.requestHandler(url, payload, this.productCreatedComplete);
};


APP.SellScreen.prototype.productCreatedComplete = function (response) {
  this.showFlash('succes', 'Su producto se envió a revisión')
  var product = response.data.product;
  var url = DataApp.currentUser.url + '/product/' + product.nameSlugify;
  var timeout = setTimeout(function () {
    clearTimeout(timeout);
    window.location.href = url;
  }, 1000);
};
