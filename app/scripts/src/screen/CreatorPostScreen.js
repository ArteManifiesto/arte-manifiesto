/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
var scope;
var timeout;

APP.CreatorPostScreen = function () {
  APP.BaseScreen.call(this, 'creatorPost');
  scope = this;
};

APP.CreatorPostScreen.constructor = APP.CreatorPostScreen;
APP.CreatorPostScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CreatorPostScreen.prototype.setupUI = function () {
  this.category = $('select[name=category]');
  this.name = $('input[name=name]');
  this.status = $('.status');
  this.delete = $('.delete-btn');
  this.deleteConfirm = $('.delete-confirm');
  this.deleteForce = $('.delete-force');
  this.cancel = $('.cancel');

  this.previewBtn = $('.preview-btn');
  this.publishBtn = $('.publish-btn');
  this.amBtn = $('.am-btn');

  this.cover = new APP.UploaderImage($('.uploader-cover'), this.coverComplete, {
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

APP.CreatorPostScreen.prototype.listeners = function () {
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

APP.CreatorPostScreen.prototype.publishHandler = function () {
  if (!post) return this.showFlash('error', ['Rellena todos los campos del post']);
  var url = '/blog/post/' + (post.published ? 'unpublish' : 'publish');
  this.requestHandler(url, {idPost: post.id}, this.publishComplete);
};

APP.CreatorPostScreen.prototype.publishComplete = function (response) {
  post = response.data.post;
  if (post.published)
    this.publishBtn.addClass('publish').text('PUBLICADO');
  else
    this.publishBtn.removeClass('publish').text('PUBLICAR');
};

APP.CreatorPostScreen.prototype.featuredHandler = function () {
  if (!post) return this.showFlash('error', ['Rellena todos los campos del post']);
  var url = '/blog/post/' + (post.featured ? 'unfeatured' : 'featured');
  this.requestHandler(url, {idPost: post.id}, this.featuredComplete);
};

APP.CreatorPostScreen.prototype.featuredComplete = function (response) {
  post = response.data.post;
  if (post.featured)
    this.amBtn.addClass('am');
  else
    this.amBtn.removeClass('am');
};

APP.CreatorPostScreen.prototype.imageStarted = function () {
  this.isUploading = true;
  this.status.text('Cargando imagenes....');
};

APP.CreatorPostScreen.prototype.progressComplete = function () {
  this.status.text('Procesando imagenes....');
};

APP.CreatorPostScreen.prototype.imageLoaded = function () {
  this.isUploading = false;
  this.autoSave(null, this.editable);
  this.status.text('Imagenes cargadas');
};

APP.CreatorPostScreen.prototype.autoSave = function (event, editable) {
  if (this.isUploading) return this.showFlash('error', ['Las imágenes aún se estan cargando']);
  var errors = [];
  var nameValue = this.name.val(), categoryValue = this.category.val();

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


APP.CreatorPostScreen.prototype.saveRequestComplete = function (response) {
  post = response.data.post;
  var url = '/blog/post/' + post.nameSlugify;
  if (edit)
    Utils.changeUrl(post.name, url + '/edit');
  this.previewBtn.attr('href', url);
  this.status.text('✓ guardado');
};

APP.CreatorPostScreen.prototype.beforeUnLoad = function (event) {
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

APP.CreatorPostScreen.prototype.coverComplete = function (idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();

  var filters = {format: 'jpg', width: 1600, crop: "limit", quality: 80};
  var img = $.cloudinary.image(idImage, filters);
  img.addClass('am-Profile-banner-img').appendTo(this.$view.find('.preview'));
  this.photo = img.attr('src');

  scope.autoSave(null, scope.editable);
};

APP.CreatorPostScreen.prototype.inputChange = function () {
  this.autoSave(null, this.editable);
};

APP.CreatorPostScreen.prototype.nameKeyUp = function () {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    scope.autoSave(null, scope.editable);
  }, 1000);
};

APP.CreatorPostScreen.prototype.deleteHandler = function (event) {
  event.preventDefault();
  this.delete.hide();
  this.previewBtn.hide();
  this.publishBtn.hide();
  this.amBtn.hide();
  this.deleteConfirm.show();
};

APP.CreatorPostScreen.prototype.cancelHandler = function (event) {
  event.preventDefault();
  this.delete.show();
  this.previewBtn.show();
  this.publishBtn.show();
  this.amBtn.show();
  this.deleteConfirm.hide();
};

APP.CreatorPostScreen.prototype.deleteForceHandler = function (event) {
  event.preventDefault();
  var url = '/blog/post/delete';
  this.requestHandler(url, {idPost: post.id}, this.deleteForceComplete);
};

APP.CreatorPostScreen.prototype.deleteForceComplete = function () {
  this.showFlash('succes', 'Se elimino tu post');
  setTimeout(function () {
    window.location.href = '/blog';
  }, 1000);
};
