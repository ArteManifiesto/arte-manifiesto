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
  this.viewer = new APP.Viewer('work', $('.grid'), null, works, {
    context: 'single-collection'
  });

  this.workDelete = $('.work-delete');
  this.workDeleteConfirm = $('.work-delete-confirm');
  this.workDeleteCancel = $('.work-delete-cancel');
  this.workDeleteForce = $('.work-delete-force');
  this.collectionForm = $('.collection-form');
  this.collectionName = $('.collection-name');
  this.collectionDescription = $('.collection-description');
  this.save = $('.save');
  this.saveLoading = $('.save-loading');
  this.public = $('input[name=public]');
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
  this.requestHandler(url, payload, this.collectionUpdateComplete);
};

APP.CollectionScreen.prototype.collectionUpdateComplete = function(response) {
  this.save.show();
  this.saveLoading.hide();

  var newCollection = response.data.collection;
  var newUrl = '/user/' + collection.User.username + '/collection/' + newCollection.nameSlugify;
  this.collectionName.text(newCollection.name);
  this.collectionDescription.text(newCollection.description);
  $('#lean_overlay').trigger('click');
  this.showFlash('succes', 'Se actualizo tu coleccion');
  Utils.changeUrl(collection.name, newUrl);
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