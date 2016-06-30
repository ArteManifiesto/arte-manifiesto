/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
var scope;
var timeout;

APP.CreatorChapterScreen = function() {
  APP.BaseScreen.call(this, 'creatorPost');
  scope = this;
};

APP.CreatorChapterScreen.constructor = APP.CreatorChapterScreen;
APP.CreatorChapterScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CreatorChapterScreen.prototype.setupUI = function() {
  this.name = $('input[name=name]');
  this.video = $('input[name=video]');
  this.releaseDate = $('input[name=releaseDate]');
  this.description = $('textarea[name=description]');

  this.status = $('.status');
  this.delete = $('.delete-btn');
  this.deleteConfirm = $('.delete-confirm');
  this.deleteForce = $('.delete-force');
  this.cancel = $('.cancel');

  this.previewBtn = $('.preview-btn');
  this.publishBtn = $('.publish-btn');

  this.thumbnail = new APP.UploaderImage($('.thumbnail-uploader'), this.coverComplete, {
    uploader: $('.editor-cover')
  });

  if (edit) {
    this.category.find('option[value=' + post.Category.id + ']').attr('selected', true);
    this.cover.photo = post.photo;
  }

  this.editable = $('.editable');

  this.editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    targetBlank: true,
    imageDragging: false,
    placeholder: {
      text: 'Ingresa el contenido del post :)',
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

  this.category.change(this.inputChange.bind(this));
  this.name.keyup(this.nameKeyUp.bind(this));

  this.delete.click(this.deleteHandler.bind(this));
  this.cancel.click(this.cancelHandler.bind(this));
  this.deleteForce.click(this.deleteForceHandler.bind(this));

  this.publishBtn.click(this.publishHandler.bind(this));
  this.amBtn.click(this.featuredHandler.bind(this));
};

APP.CreatorChapterScreen.prototype.publishHandler = function() {
  if (!post) return this.showFlash('error', ['Rellena todos los campos del post']);
  var url = '/blog/post/' + (post.published ? 'unpublish' : 'publish');
  this.requestHandler(url, {
    idPost: post.id
  }, this.publishComplete);
};

APP.CreatorChapterScreen.prototype.publishComplete = function(response) {
  post = response.data.post;
  if (post.published)
    this.publishBtn.addClass('publish').text('PUBLICADO');
  else
    this.publishBtn.removeClass('publish').text('PUBLICAR');
};

APP.CreatorChapterScreen.prototype.featuredHandler = function() {
  if (!post) return this.showFlash('error', ['Rellena todos los campos del post']);
  var url = '/blog/post/' + (post.featured ? 'unfeatured' : 'featured');
  this.requestHandler(url, {
    idPost: post.id
  }, this.featuredComplete);
};

APP.CreatorChapterScreen.prototype.featuredComplete = function(response) {
  post = response.data.post;
  if (post.featured)
    this.amBtn.addClass('am');
  else
    this.amBtn.removeClass('am');
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
  var nameValue = this.name.val(),
    categoryValue = this.category.val();

  this.editable = editable;

  if (nameValue.trim().length < 1)
    errors.push('Agrega un titulo');

  if (categoryValue === null)
    errors.push('Selecciona una categoria');

  if (this.cover.photo === null)
    errors.push('Selecciona una imagen de cover');

  if (errors.length > 0) return this.showFlash('error', errors);

  var body = this.editor.serialize()['element-0']['value'];

  editable = $(editable);

  var payload = {
    body: body,
    name: nameValue,
    category: categoryValue,
    description: editable.find('p').text().substr(0, 180),
    photo: this.cover.photo
  };

  this.status.text('Guardando.....');

  var url;
  if (!post) {
    url = '/blog/post/create';
  } else {
    url = '/blog/post/update';
    payload.idPost = post.id;
  }

  this.requestHandler(url, payload, this.saveRequestComplete);
};


APP.CreatorChapterScreen.prototype.saveRequestComplete = function(response) {
  post = response.data.post;
  var url = '/blog/post/' + post.nameSlugify;
  if (edit)
    Utils.changeUrl(post.name, url + '/edit');
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

APP.CreatorChapterScreen.prototype.thumbnailComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();

  var filters = {
    width: 300,
    crop: 'limit'
  };

  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));

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
  this.amBtn.hide();
  this.deleteConfirm.show();
};

APP.CreatorChapterScreen.prototype.cancelHandler = function(event) {
  event.preventDefault();
  this.delete.show();
  this.previewBtn.show();
  this.publishBtn.show();
  this.amBtn.show();
  this.deleteConfirm.hide();
};

APP.CreatorChapterScreen.prototype.deleteForceHandler = function(event) {
  event.preventDefault();
  var url = '/blog/post/delete';
  this.requestHandler(url, {
    idPost: post.id
  }, this.deleteForceComplete);
};

APP.CreatorChapterScreen.prototype.deleteForceComplete = function() {
  this.showFlash('succes', 'Se elimino tu post');
  setTimeout(function() {
    window.location.href = '/blog';
  }, 1000);
};