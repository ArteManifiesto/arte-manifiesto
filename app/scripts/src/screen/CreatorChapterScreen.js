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
  this.works = $('input[name=works]');
  this.description = $('textarea[name=description]');

  this.send = $('.send');
  this.sendLoading = $('.send-loading');

  this.releaseDate.mask("99/99/9999");

  this.delete = $('.delete-btn');
  this.deleteConfirm = $('.delete-confirm');
  this.deleteForce = $('.delete-force');
  this.cancel = $('.cancel');
  this.publishBtn = $('.publish-btn');

  if (edit) {
    $('input[name=hasContest]').attr('checked', chapter.hasContest);
  }

  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete);
  if (edit) {
    this.uploaderImage.photo = chapter.photo;
  }

  $('input[type=checkbox]').change(this.checkHasContestHandler);
  $('input[type=checkbox]').change();
};

APP.CreatorChapterScreen.prototype.checkHasContestHandler = function() {
  $(this).parent().find('.value').text((this.checked ? 'On' : 'Off'));
}

APP.CreatorChapterScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.chapterForm.submit(this.chapterFormSubmitHandler.bind(this));

  this.delete.click(this.deleteHandler.bind(this));
  this.cancel.click(this.cancelHandler.bind(this));
  this.deleteForce.click(this.deleteForceHandler.bind(this));

  this.publishBtn.click(this.publishHandler.bind(this));
};

APP.CreatorChapterScreen.prototype.publishHandler = function() {
  var url = '/tv/chapter/' + (chapter.published ? 'unpublish' : 'publish');
  this.requestHandler(url, {
    idChapter: chapter.id
  }, this.publishComplete);
};

APP.CreatorChapterScreen.prototype.publishComplete = function(response) {
  chapter = response.data.chapter;
  if (chapter.published)
    this.publishBtn.addClass('publish').text('PUBLICADO');
  else
    this.publishBtn.removeClass('publish').text('PUBLICAR');
};


APP.CreatorChapterScreen.prototype.deleteHandler = function(event) {
  event.preventDefault();
  this.delete.hide();
  this.publishBtn.hide();
  this.deleteConfirm.show();
};

APP.CreatorChapterScreen.prototype.cancelHandler = function(event) {
  event.preventDefault();
  this.delete.show();
  this.publishBtn.show();
  this.deleteConfirm.hide();
};

APP.CreatorChapterScreen.prototype.deleteForceHandler = function(event) {
  event.preventDefault();
  var url = '/tv/chapter/delete';
  this.requestHandler(url, {
    idChapter: chapter.id
  }, this.deleteForceComplete);
};

APP.CreatorChapterScreen.prototype.deleteForceComplete = function() {
  this.showFlash('succes', 'Se elimino el capítulo');
  setTimeout(function() {
    window.location.href = '/tv';
  }, 1000);
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
  if (Validations.notBlank(this.works.val())) errors.push('Ingresa las obras del capítulo');
  if (Validations.notBlank(this.description.val())) errors.push('Ingrese una descripcion');

  if (errors.length > 0) return this.showFlash('error', errors);

  this.sendLoading.show();
  this.send.hide();

  var data = this.chapterForm.serializeArray();
  $.each(data, function(index, value) {
    if (value.name === 'photo')
      value.value = scope.uploaderImage.photo;

    if (value.name === 'hasContest')
      value.value = value.value === 'on'
  });

  var url = edit ? '/tv/chapter/update' : '/tv/chapter/create';

  this.requestHandler(url, data, this.chapterCreatedComplete);
};

APP.CreatorChapterScreen.prototype.chapterCreatedComplete = function(response) {
  if (edit) {
    this.showFlash('succes', 'Su capítulo se actualizó exitosamente');
  } else {
    this.showFlash('succes', 'Su capítulo se subió exitosamente');
  }

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