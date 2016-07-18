/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
var scope;
var timeout;

APP.CreatorChapterScreen = function() {
  APP.BaseScreen.call(this, 'creatorChapter');
  scope = this;
};

APP.CreatorChapterScreen.constructor = APP.CreatorChapterScreen;
APP.CreatorChapterScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CreatorChapterScreen.prototype.setupUI = function() {
  this.name = $('input[name=name]');
  this.trailer = $('input[name=trailer]');
  this.video = $('input[name=video]');
  this.releaseDate = $('input[name=releaseDate]');
  this.description = $('textarea[name=description]');

  this.releaseDate.mask("99/99/9999");

  this.status = $('.status');
  this.delete = $('.delete-btn');
  this.deleteConfirm = $('.delete-confirm');
  this.deleteForce = $('.delete-force');
  this.cancel = $('.cancel');

  this.previewBtn = $('.preview-btn');
  this.publishBtn = $('.publish-btn');

  this.cover = new APP.UploaderImage($('.uploader-cover'), this.coverComplete, {
    uploader: $('.editor-cover')
  });

  if (edit) {
    this.cover.photo = chapter.photo;
  }

  this.editable = $('.editable');

  this.editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    targetBlank: true,
    imageDragging: false,
    placeholder: {
      text: 'Ingresa el contenido del capitulo :)',
    },
    toolbar: {
      buttons: [
        'h2', 'h3', 'bold', 'italic', 'quote', 'anchor',
        'justifyLeft', 'justifyCenter', 'justifyRight'
      ]
    }
  });

  this.editable.mediumInsert({
    editor: this.editor,
    addons: {
      embeds: {
        placeholder: 'Inserta el código de embebido de youtube y luego presiona enter'
      }
    }
  });

  this.isUploading = false;
};

APP.CreatorChapterScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  Broadcaster.addEventListener('imageStarted', this.imageStarted.bind(this));
  Broadcaster.addEventListener('imageProgressComplete', this.progressComplete.bind(this));
  Broadcaster.addEventListener('imageLoaded', this.imageLoaded.bind(this));

  var throttledAutoSave = MediumEditor.util.throttle(this.autoSave.bind(this), 2000);
  this.editor.subscribe('editableInput', throttledAutoSave);

  window.onbeforeunload = this.beforeUnLoad.bind(this);

  this.name.keyup(this.nameKeyUp.bind(this));

  this.delete.click(this.deleteHandler.bind(this));
  this.cancel.click(this.cancelHandler.bind(this));
  this.deleteForce.click(this.deleteForceHandler.bind(this));

  this.publishBtn.click(this.publishHandler.bind(this));

};

APP.CreatorChapterScreen.prototype.publishHandler = function() {
  if (!chapter) return this.showFlash('error', ['Rellena todos los campos del chapter']);
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


APP.CreatorChapterScreen.prototype.imageStarted = function() {
  this.isUploading = true;
  this.status.text('Cargando imagenes....');
};

APP.CreatorChapterScreen.prototype.progressComplete = function() {
  this.status.text('Procesando imagenes....');
};

APP.CreatorChapterScreen.prototype.imageLoaded = function() {
  this.isUploading = false;
  this.autoSave(null, this.editable);
  this.status.text('Imagenes cargadas');
};

APP.CreatorChapterScreen.prototype.autoSave = function(event, editable) {
  if (this.isUploading) return this.showFlash('error', ['Las imágenes aún se estan cargando']);
  var errors = [];
  var nameValue = this.name.val();
  var trailerValue = this.trailer.val();
  var videoValue = this.video.val();
  var releaseDateValue = this.releaseDate.val();
  var descriptionValue = this.description.val();

  this.editable = editable;

  if (nameValue.trim().length < 1)
    errors.push('Agrega un titulo');

  if (trailerValue.trim().length < 1)
    errors.push('Agrega una trailer');

  if (videoValue.trim().length < 1)
    errors.push('Agrega el video');

  if (releaseDateValue.trim().length < 1)
    errors.push('Agrega la de fecha de emisión');

  if (descriptionValue.trim().length < 1)
    errors.push('Agrega la descripción');

  if (this.cover.photo === null)
    errors.push('Selecciona una imagen de cover');

  if (errors.length > 0) return this.showFlash('error', errors);

  var body = this.editor.serialize()['element-0']['value'];

  editable = $(editable);

  var payload = {
    body: body,
    name: nameValue,
    trailer: trailerValue,
    video: videoValue,
    releaseDate: releaseDateValue,
    description: descriptionValue,
    photo: this.cover.photo
  };

  this.status.text('Guardando.....');

  var url;
  if (!chapter) {
    url = '/tv/chapter/create';
  } else {
    url = '/tv/chapter/update';
    payload.idChapter = chapter.id;
  }
  
  this.requestHandler(url, payload, this.saveRequestComplete);
};


APP.CreatorChapterScreen.prototype.saveRequestComplete = function(response) {
  chapter = response.data.chapter;
  var url = '/tv/chapter/' + chapter.nameSlugify;
  if (edit)
    Utils.changeUrl(chapter.name, url + '/edit');
  this.previewBtn.attr('href', url);
  this.status.text('✓ guardado');
};

APP.CreatorChapterScreen.prototype.beforeUnLoad = function(event) {
  if (this.isUploading) {
    var message = 'Aun no se han guardado tus cambios!';
    if (typeof event == 'undefined') {
      event = window.event;
    }
    if (event) {
      event.returnValue = message;
    }
    return message;
  }
};

APP.CreatorChapterScreen.prototype.coverComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();

  var filters = {
    format: 'jpg',
    width: 1600,
    crop: "limit",
    quality: 80
  };
  var img = $.cloudinary.image(idImage, filters);
  img.addClass('am-Profile-banner-img').appendTo(this.$view.find('.preview'));
  this.photo = img.attr('src');

  scope.autoSave(null, scope.editable);
};

APP.CreatorChapterScreen.prototype.inputChange = function() {
  this.autoSave(null, this.editable);
};

APP.CreatorChapterScreen.prototype.nameKeyUp = function() {
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    scope.autoSave(null, scope.editable);
  }, 1000);
};

APP.CreatorChapterScreen.prototype.deleteHandler = function(event) {
  event.preventDefault();
  this.delete.hide();
  this.previewBtn.hide();
  this.publishBtn.hide();
  this.deleteConfirm.show();
};

APP.CreatorChapterScreen.prototype.cancelHandler = function(event) {
  event.preventDefault();
  this.delete.show();
  this.previewBtn.show();
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
  this.showFlash('succes', 'Se elimino el capitulo');
  setTimeout(function() {
    window.location.href = '/tv';
  }, 1000);
};