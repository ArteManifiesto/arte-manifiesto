/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CreatorPostScreen = function () {
  APP.BaseScreen.call(this, 'creatorPost');
};

APP.CreatorPostScreen.constructor = APP.CreatorPostScreen;
APP.CreatorPostScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CreatorPostScreen.prototype.setupUI = function () {
  this.category = $('select[name=category]');
  this.name = $('input[name=name]');
  this.status = $('.status');


  this.cover = new APP.UploaderImage($('.uploader-work'), this.coverComplete, {
    uploader: $('.editor-cover')
  });

  if(edit) {
    this.category.find('option[value=' + post.Category.id + ']').attr('selected', true);
    this.cover.photo = post.photo;
  }
  this.editable = $('.editable');

  this.editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    targetBlank: true,
    imageDragging: false,
    toolbar: {
      buttons: [
        'h2', 'h3', 'bold', 'italic', 'quote', 'anchor'
      ]
    }
  });

  this.editable.mediumInsert({
    editor: this.editor,
    addons: {
      embeds: false
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
  this.autoSave(null, null);
  this.status.text('Imagenes cargadas');
};

APP.CreatorPostScreen.prototype.autoSave = function (event, editable) {
  var errors = [];
  var nameValue = this.name.val(), categoryValue = this.category.val();

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


APP.CreatorPostScreen.prototype.coverComplete = function(idImage) {
   this.$view.find('.upload').show();
   this.uploader.show();
   var filters =  {width: 300, crop: 'limit'};
   $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
}
