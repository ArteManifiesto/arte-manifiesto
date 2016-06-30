
/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CreatorChapterScreen = function() {
  APP.BaseScreen.call(this, 'creatorChapterScreen');
  this.chapter = null;
};

APP.CreatorChapterScreen.constructor = APP.CreatorChapterScreen;
APP.CreatorChapterScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CreatorChapterScreen.prototype.setupUI = function() {
  this.chapterForm = $('.chapter-form');
  this.uploader = $('.uploader-chapter');
  
  this.name = $('input[name=name]');
  this.trailer = $('input[name=trailer]');
  this.video = $('input[name=video]');
  this.releaseDate = $('input[name=releaseDate]');
  this.description = $('textarea[name=description]');

  this.send = $('.send');
  this.sendLoading = $('.send-loading');


  this.releaseDate.mask("99/99/9999");


  // this.chapterDelete = $('.work-delete');
  // this.chapterDeleteConfirm = $('.work-delete-confirm');
  // this.chapterDeleteCancel = $('.work-delete-cancel');
  // this.chapterDeleteForce = $('.work-delete-force');

  // this.workPhotoPublished = $('.work-photo-published');
  // this.workNamePublished = $('.work-name-published');
  // this.workUserPublished = $('.work-user-published');
  // this.workPublished = $('.work-published');
  // this.workView = $('.work-view');
  // this.workNew = $('.work-new');
  // this.workEdit = $('.work-edit');

  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete);
};

APP.CreatorChapterScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.chapterForm.submit(this.chapterFormSubmitHandler.bind(this));

  // this.chapterDelete.click(this.deleteHandler.bind(this));
  // this.chapterDeleteForce.click(this.chapterDeleteForceHandler.bind(this));
  // this.chapterDeleteCancel.click(this.deleteCancel.bind(this));
};

APP.CreatorChapterScreen.prototype.chapterFormSubmitHandler = function(event) {
  event.preventDefault();
  var errors = [],
    scope = this;
  if (!this.uploaderImage.photo) errors.push('Ingrese una foto');
  if (Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');
  if (Validations.notBlank(this.trailer.val())) errors.push('Ingresa un trailer');
  if (Validations.notBlank(this.video.val())) errors.push('Ingresa un video');
  if (Validations.notBlank(this.releaseDate.val())) errors.push('Ingresa la fecha de emisión');
  if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');

  if (errors.length > 0) return this.showFlash('error', errors);

  this.sendLoading.show();
  this.send.hide();

  var data = this.chapterForm.serializeArray();
  $.each(data, function(index, value) {
    if (value.name === 'photo')
      value.value = scope.uploaderImage.photo;
  });

  var url = '/tv/chapter/create';
  this.requestHandler(url, data, this.chapterCreatedComplete);
};

APP.CreatorChapterScreen.prototype.chapterCreatedComplete = function(response) {
  this.showFlash('succes', 'Su capítulo se subió exitosamente');
  this.chapter = response.data.chapter;
  
  setTimeout((function() {
    window.location.href = '/tv/chapter/' + this.chapter.nameSlugify
  }).bind(this), 1000);

  // this.chapterForm.hide();

  // this.sendLoading.hide();
  // this.send.show();

  // var url = DataApp.currentUser.url + '/work/' + this.work.nameSlugify
  // var photo = Utils.addImageFilter(this.work.photo, 'w_300,c_limit');

  // this.workView.attr('href', url);
  // this.workNew.attr('href', DataApp.currentUser.url + '/work/add');
  // this.workEdit.attr('href', url + '/edit');
  // this.workPhotoPublished.attr('src', photo);
  // this.workNamePublished.text(this.work.name);
  // this.workUserPublished.text(DataApp.currentUser.fullname);
  // this.workPublished.show();
};

APP.CreatorChapterScreen.prototype.deleteHandler = function(event) {
  this.chapterDelete.hide();
  this.chapterDeleteConfirm.show();
};

APP.CreatorChapterScreen.prototype.chapterDeleteForceHandler = function() {
  var url = DataApp.currentUser.url + '/work/delete';
  this.requestHandler(url, {
    idWork: this.work.id
  }, this.forceComplete);
};

APP.CreatorChapterScreen.prototype.forceComplete = function() {
  this.showFlash('succes', 'Se elimino tu obra');
  setTimeout(function() {
    window.location.href = DataApp.currentUser.url;
  }, 1000);
};

APP.CreatorChapterScreen.prototype.deleteCancel = function(response) {
  this.chapterDelete.show();
  this.chapterDeleteConfirm.hide();
};

APP.CreatorChapterScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};