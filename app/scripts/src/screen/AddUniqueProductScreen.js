/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AddUniqueProductScreen = function() {
  APP.BaseScreen.call(this, 'addProduct');
  this.product = null;
};

APP.AddUniqueProductScreen.constructor = APP.AddUniqueProductScreen;
APP.AddUniqueProductScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AddUniqueProductScreen.prototype.setupUI = function() {
  this.workForm = $('.work-form');
  this.uploader = $('.uploader-work');
  this.uploader2 = $('.uploader-work2');
  this.name = $('input[name=name]');
  this.shortDescription = $('input[name=short]');
  this.weight = $('input[name=weight]');
  this.price = $('input[name=price]');
  this.profit = $('input[name=profit]');
  this.profit.val('30');
  this.finalPrice = $('input[name=finalPrice]');
  this.category = $('select[name=category]');
  this.description = $('textarea[name=description]');
  this.information = $('textarea[name=information]');

  this.workPhotoPublished = $('.work-photo-published');
  this.workNamePublished = $('.work-name-published');
  this.workUserPublished = $('.work-user-published');
  this.workPublished = $('.work-published');
  this.workView = $('.work-view');
  this.workNew = $('.work-new');

  this.workDelete = $('.work-delete');
  this.workDeleteConfirm = $('.work-delete-confirm');
  this.workDeleteCancel = $('.work-delete-cancel');
  this.workDeleteForce = $('.work-delete-force');

  this.tags = $('input[name=tags]');
  this.tags.tagsInput({
    height: '50px',
    width: '100%',
    defaultText: '+Etiqueta'
  });
  
  this.send = $('.send');
  this.sendLoading = $('.send-loading');

  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete, {uploader:$('*[data-cloudinary-field="photo"]')});
  this.uploaderImage2 = new APP.UploaderImage(this.uploader2, this.imgComplete2, {uploader:$('*[data-cloudinary-field="photo2"]')});
};

APP.AddUniqueProductScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.workForm.submit(this.workFormSubmitHandler.bind(this));
  this.workDelete.click(this.deleteHandler.bind(this));
  this.workDeleteForce.click(this.workDeleteForceHandler.bind(this));
  this.workDeleteCancel.click(this.deleteCancel.bind(this));
  this.price.on('input change paste',this.priceHandler.bind(this));
  this.finalPrice.on('input change paste',this.finalPriceHandler.bind(this));
};


APP.AddUniqueProductScreen.prototype.workFormSubmitHandler = function(event) {
  event.preventDefault();
  var errors = [],
    scope = this;
  if (!this.uploaderImage.photo) errors.push('Ingrese una foto principal');
  if (!this.uploaderImage2.photo) errors.push('Ingrese una foto secundaria');
  if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
  if (Validations.notBlank(this.weight.val())) errors.push('Ingrese un peso');
  if (Validations.notBlank(this.price.val())) errors.push('Ingrese un precio de proveedor');
  if (Validations.notBlank(this.profit.val())) errors.push('Ingrese una ganancia de AM');
  if (Validations.notBlank(this.finalPrice.val())) errors.push('Ingrese el precio final');
  if (Validations.notBlank(this.category.val())) errors.push('Ingrese una categoria');
  if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');
  if (Validations.notBlank(this.information.val())) errors.push('Ingrese informacion del producto');
  if (this.tags.val().split(',')[0].length < 1) errors.push('Ingrese etiquetas');

  if (errors.length > 0) return this.showFlash('error', errors);

  this.sendLoading.show();
  this.send.hide();

  var info = this.information.val().split('\n');

  var config = {
    weight: this.weight.val(),
    description: this.description.val(),
    profit: this.profit.val(),
    info: JSON.stringify(info)
  }

  var descriptionTemp = null;

  if(this.shortDescription.val()) descriptionTemp = this.shortDescription.val();

  var data = {
    product:{
      name: this.name.val(),
      description: descriptionTemp,
      price: (Math.round(parseInt(this.finalPrice.val()) * 1.2)).toString(),
      finalPrice: this.finalPrice.val(),
      photo: scope.uploaderImage.photo,
      printPhoto: scope.uploaderImage.photo,
      config: JSON.stringify(config),
      CategoryId: this.category.val()
    },
    work:{
      name: this.name.val(),
      description: descriptionTemp,
      photo: scope.uploaderImage2.photo,
      public: false,
      visible: false,
      nsfw: true,
      featured: false
    },
    tags: this.tags.val().split(',')
  };
  var url = responseUrl + '/product/createunique';
  this.requestHandler(url, {
    data: JSON.stringify(data)
  }, this.workCreatedComplete);
};

APP.AddUniqueProductScreen.prototype.workCreatedComplete = function(response) {
  this.showFlash('succes', 'El producto se subió exitosamente')
  this.work = response.data.product;

  this.workForm.hide();

  this.sendLoading.hide();
  this.send.show();

  var url = '/report/products_applying/page-1'
  var photo = Utils.addImageFilter(this.work.photo, 'w_300,c_limit');

  this.workView.attr('href', url);
  this.workNew.attr('href', responseUrl + '/product/add');
  this.workPhotoPublished.attr('src', photo);
  this.workNamePublished.text(this.work.name);
  this.workPublished.show();
};

APP.AddUniqueProductScreen.prototype.deleteHandler = function(event) {
  this.workDelete.hide();
  this.workDeleteConfirm.show();
};

APP.AddUniqueProductScreen.prototype.workDeleteForceHandler = function() {
  var url = responseUrl + '/product/delete';
  this.requestHandler(url, {
    id: this.work.id
  }, this.forceComplete);
};

APP.AddUniqueProductScreen.prototype.forceComplete = function() {
  this.showFlash('succes', 'Se elimino el product');
  setTimeout(function() {
    window.location.href = responseUrl;
  }, 1000);
};

APP.AddUniqueProductScreen.prototype.deleteCancel = function(response) {
  this.workDelete.show();
  this.workDeleteConfirm.hide();
};

APP.AddUniqueProductScreen.prototype.priceHandler = function(event) {
  var percentage = 100 - parseFloat(this.profit.val());
  var preTax = (100 * parseFloat(this.price.val())) / percentage;
  var tax = 1.18
  this.finalPrice.val(Math.round(preTax * tax));
};

APP.AddUniqueProductScreen.prototype.finalPriceHandler = function(event) {
  var tax = 1.18
  var percentage = 100 - parseFloat(this.profit.val());
  var preTax = parseFloat(this.finalPrice.val()) / tax;
  this.price.val(Math.round((preTax * percentage) / 100));
};

APP.AddUniqueProductScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};

APP.AddUniqueProductScreen.prototype.imgComplete2 = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};