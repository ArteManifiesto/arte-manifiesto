/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.EditWorkScreen = function () {
  APP.BaseScreen.call(this, 'editWork');
  this.work = work;
};

APP.EditWorkScreen.constructor = APP.EditWorkScreen;
APP.EditWorkScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.EditWorkScreen.prototype.setupUI = function() {
  this.workForm = $('.work-form');
  this.uploaderImage = new APP.UploaderImage($('.uploader-work'), this.uploaderImageComplete);
  this.uploaderImage.photo = work.photo;
  this.name = $('input[name=name]');
  this.category = $('select[name=category]');
  $('select[name=category]').find('option[value=' + category.id + ']').attr('selected', true);
  this.description = $('textarea[name=description]');
  this.tags = $('input[name=tags]');
  this.tags.tagsInput({height:'50px', width:'100%', defaultText:'+Etiqueta'});

  this.send = $('.send');
  this.sendLoading = $('.send-loading');

  this.workDelete = $('.work-delete');
  this.workDeleteConfirm = $('.work-delete-confirm');
  this.workDeleteCancel = $('.work-delete-cancel');
  this.workDeleteForce = $('.work-delete-force');
};

APP.EditWorkScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
  this.workForm.submit(this.workFormSubmitHandler.bind(this));

  this.workDelete.click(this.workDeleteHandler.bind(this));
  this.workDeleteForce.click(this.workDeleteForceHandler.bind(this));
  this.workDeleteCancel.click(this.workDeleteCancelHandler.bind(this));
  $('input[type=checkbox]').change(this.checkPublicHandler);
};

APP.EditWorkScreen.prototype.checkPublicHandler = function() {
  $(this).parent().find('.value').text((this.checked ? 'On' : 'Off'));
}

APP.EditWorkScreen.prototype.workFormSubmitHandler = function(event) {
  event.preventDefault();
  var errors = [], scope = this;
  if(!this.uploaderImage.photo) errors.push('photo');
  if(Validations.notBlank(this.name.val())) errors.push('name');
  if(Validations.notBlank(this.category.val())) errors.push('category');
  if(Validations.notBlank(this.description.val())) errors.push('description');
  if(this.tags.val().split(',')[0].length < 1) errors.push('tags');

  if(errors.length > 0) return this.showFlash('error', errors);

  this.sendLoading.show();
  this.send.hide();

  var data = this.workForm.serializeArray();
  $.each(data, function(index, value) {
    if (value.name === 'photo')
      value.value = scope.uploaderImage.photo;

    if(value.name === 'nsfw' || value.name === 'public')
      value.value = (value.value === 'on');
  });

  var url = DataApp.currentUser.url + '/work/update';
  this.requestHandler(url, data, this.workUpdatedComplete);
};

APP.EditWorkScreen.prototype.workUpdatedComplete = function(response) {
  this.showFlash('succes', 'Su obra se actualizo exitosamente')
  this.work = response.data.work;

  this.sendLoading.hide();
  this.send.show();

  var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
  Utils.changeUrl(work.name, url);
};

APP.EditWorkScreen.prototype.workDeleteHandler = function (event) {
  event.preventDefault();
  this.workDelete.hide();
  this.workDeleteConfirm.show();
};

APP.EditWorkScreen.prototype.workDeleteForceHandler = function () {
  var url = DataApp.currentUser.url + '/work/delete';
  this.requestHandler(url, {idWork: this.work.id}, this.workDeleteForceComplete);
};

APP.EditWorkScreen.prototype.workDeleteForceComplete = function () {
  this.showFlash('succes', 'Se elimino tu obra');
  setTimeout(function () {
    window.location.href = DataApp.currentUser.url;
  }, 1000);
};

APP.EditWorkScreen.prototype.workDeleteCancelHandler = function (response) {
  this.workDelete.show();
  this.workDeleteConfirm.hide();
};

APP.EditWorkScreen.prototype.uploaderImageComplete = function(idImage) {
   this.$view.find('.upload').show();
   $('.cloudinary-fileupload').show();
   var filters =  {width: 300, crop: 'limit'};
   $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};
