/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AddProductScreen = function() {
  APP.BaseScreen.call(this, 'addProduct');
  this.product = null;
};

APP.AddProductScreen.constructor = APP.AddProductScreen;
APP.AddProductScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AddProductScreen.prototype.setupUI = function() {
  this.workForm = $('.work-form');
  this.uploader = $('.uploader-work');
  this.name = $('input[name=name]');
  this.shortDescription = $('input[name=short]');
  this.weight = $('input[name=weight]');
  this.price = $('input[name=price]');
  this.profit = $('input[name=profit]');
  this.finalPrice = $('input[name=finalPrice]');
  this.category = $('select[name=category]');
  this.description = $('textarea[name=description]');
  this.information = $('textarea[name=information]');

  this.tags = $('input[name=tags]');
  this.tags.tagsInput({
    height: '50px',
    width: '100%',
    defaultText: '+Etiqueta'
  });

  this.send = $('.send');
  this.sendLoading = $('.send-loading');

  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete);
};

APP.AddProductScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.workForm.submit(this.workFormSubmitHandler.bind(this));
  this.profit.on('input change paste',this.priceHandler.bind(this));
  this.category.change(this.categoryHandler.bind(this));
};


APP.AddProductScreen.prototype.workFormSubmitHandler = function(event) {
  event.preventDefault();
  var errors = [],
    scope = this;
  if (!this.uploaderImage.photo) errors.push('Ingrese una foto');
  if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
  if (Validations.notBlank(this.shortDescription.val())) errors.push('Ingrese una descripcion corta');
  if (Validations.notBlank(this.weight.val())) errors.push('Ingrese un peso');
  if (Validations.notBlank(this.price.val())) errors.push('Ingrese un precio');
  if (Validations.notBlank(this.profit.val())) errors.push('Ingrese una ganancia de artista');
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
  var data = {
    name: this.name.val(),
    description: this.shortDescription.val(),
    price: (Math.round(parseInt(this.finalPrice.val()) * 1.2)).toString(),
    finalPrice: this.finalPrice.val(),
    photo: scope.uploaderImage.photo,
    printPhoto: scope.uploaderImage.photo,
    config: JSON.stringify(config),
    UserId: work.UserId,
    WorkId: work.id,
    CategoryId: this.category.val()
  };

  var url = DataApp.currentUser.url + '/product/create';
  this.requestHandler(url, {
    data: JSON.stringify(data)
  }, this.workCreatedComplete);
};

APP.AddProductScreen.prototype.workCreatedComplete = function(response) {
  this.showFlash('succes', 'El producto se subió exitosamente')
  this.work = response.data.work;

  this.workForm.hide();

  this.sendLoading.hide();
  this.send.show();

  var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
  var photo = Utils.addImageFilter(this.work.photo, 'w_300,c_limit');

  this.workView.attr('href', url);
  this.workNew.attr('href', DataApp.currentUser.url + '/work/add');
  this.workEdit.attr('href', url + '/edit');
  this.workPhotoPublished.attr('src', photo);
  this.workNamePublished.text(this.work.name);
  this.workUserPublished.text(DataApp.currentUser.fullname);
  this.workPublished.show();
};

APP.AddProductScreen.prototype.categoryHandler = function(event) {
  var i = this.category.find(':selected').data('info')
  var data = JSON.parse(categories[i-1].data);

  this.description.val(data.description);
  this.weight.val(data.weight);
  this.price.val(data.price);
  for(line in data.info){
    this.information.append(data.info[line]+'\n');
  }

};

APP.AddProductScreen.prototype.priceHandler = function(event) {
  var pro = parseFloat(this.profit.val()) / 100 + 1
  var preTax = parseFloat(this.price.val()) * pro;
  var tax = 1.18
  this.finalPrice.val(Math.round(preTax * tax));
};

APP.AddProductScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};