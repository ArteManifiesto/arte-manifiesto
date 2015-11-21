/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Product = function (data) {
    APP.BaseElement.call(this, data, 'product');
};

APP.Product.prototype = Object.create(APP.BaseElement.prototype);

APP.Product.constructor = APP.Product;


APP.Product.prototype.listeners = function () {
  APP.BaseElement.prototype.listeners.call(this);
  this.view.find('.delete').click(this.deleteHandler.bind(this));
  this.view.find('.edit').click(this.editHandler.bind(this));
};

APP.Product.prototype.deleteHandler = function() {
  var url = '/user/'+ this.data.User.username +'/product/delete';
  var scope = this;
  $.post(url,{idProduct: this.data.id}, function (response) {
    if(response.status === 200)
      $(scope.view.parent()).masonry('remove', scope.view).masonry();
  });
};

APP.Product.prototype.editHandler = function() {
  location.href = '/user/'+ this.data.User.username +'/product/'+ this.data.nameSlugify +'/edit';
};
