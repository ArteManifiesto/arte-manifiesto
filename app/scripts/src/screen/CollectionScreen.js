/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CollectionScreen = function() {
  APP.BaseScreen.call(this, 'collection');
};

APP.CollectionScreen.constructor = APP.CollectionScreen;
APP.CollectionScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.CollectionScreen.prototype.setupUI = function() {
  this.viewer = null;
  if (collection.meta === 'works') {
    this.viewer = new APP.Viewer('work', $('.grid'), null, items, {
      context: 'single-collection'
    });
  } else {
    this.viewer = new APP.Viewer('product', $('.grid'), null, items, {
      context: 'single-collection'
    });
  }

  this.workDelete = $('.work-delete');
  this.workDeleteConfirm = $('.work-delete-confirm');
  this.workDeleteCancel = $('.work-delete-cancel');
  this.workDeleteForce = $('.work-delete-force');
  this.uploader = $('.uploader-work');
  this.collectionForm = $('.collection-form');
  this.collectionName = $('.collection-name');
  this.collectionDescription = $('.collection-description');
  this.save = $('.save');
  this.saveLoading = $('.save-loading');
  this.public = $('input[name=public]');
  this.uploaderImage = new APP.UploaderImage(this.uploader, this.imgComplete, {uploader:$('*[data-cloudinary-field="photo"]')});
  $('#go-collection-modal').leanModal();
};

APP.CollectionScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.workDelete.click(this.workDeleteHandler.bind(this));
  this.workDeleteForce.click(this.workDeleteForceHandler.bind(this));
  this.workDeleteCancel.click(this.workDeleteCancelHandler.bind(this));
  this.save.click(this.saveHandler.bind(this));
  this.collectionForm.submit(this.collectionFormHandler.bind(this));
  this.public.change(this.publicChangeHandler);
  this.public.change();
};

APP.CollectionScreen.prototype.saveHandler = function() {
  this.collectionForm.submit();
};

APP.CollectionScreen.prototype.imgComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 300,
    crop: 'limit'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
};

APP.CollectionScreen.prototype.publicChangeHandler = function() {
  $(this).parent().find('.value').text((this.checked ? 'On' : 'Off'));
}

APP.CollectionScreen.prototype.collectionFormHandler = function(event) {
  event.preventDefault();
  this.save.hide();
  this.saveLoading.show();

  var url = DataApp.currentUser.url + '/collection/update';
  var payload = {
    name: $('input[name=name]').val(),
    description: $('textarea[name=description]').val(),
    public: $('input[name=public]:checked').val() !== undefined,
    idCollection: collection.id
  }
  if(this.uploaderImage.photo){
    payload.cover = this.uploaderImage.photo;
  }
  this.requestHandler(url, payload, this.collectionUpdateComplete);
};

APP.CollectionScreen.prototype.collectionUpdateComplete = function(response) {
  this.save.show();
  this.saveLoading.hide();

  var newCollection = response.data.collection;
  var newUrl = '/user/' + collection.User.username + '/collection/' + newCollection.nameSlugify;
  this.showFlash('succes', 'Se actualizo tu coleccion');
  setTimeout(function() {
    Utils.changeUrl(collection.name, newUrl);
    location.reload();
  }, 1000);
  
}

APP.CollectionScreen.prototype.workDeleteCancelHandler = function() {
  this.workDelete.show();
  this.workDeleteConfirm.hide();
};

APP.CollectionScreen.prototype.workDeleteHandler = function() {
  this.workDelete.hide();
  this.workDeleteConfirm.show();
};

APP.CollectionScreen.prototype.workDeleteForceHandler = function() {
  var url = DataApp.currentUser.url + '/collection/delete';
  this.requestHandler(url, {
    idCollection: collection.id
  }, this.collectionDeleteComplete);
};

APP.CollectionScreen.prototype.collectionDeleteComplete = function() {
  $('#lean_overlay').trigger('click');
  this.showFlash('succes', 'Se elimino tu coleccion');
  setTimeout(function() {
    window.location.href = '/user/' + collection.User.username + '/collections';
  }, 1000);
}