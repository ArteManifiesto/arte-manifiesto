/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.FeedScreen = function() {
  APP.BaseScreen.call(this, 'feed');

  this.idCollections = [];
  this.collections = [];
  this.currentWork = null;
};

APP.FeedScreen.constructor = APP.FeedScreen;
APP.FeedScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.FeedScreen.prototype.setupUI = function() {
  APP.BaseScreen.prototype.setupUI.call(this);

  this.saveBtn = $('.save-collections');
  this.saveBtnLoading = $('.save-collections-loading');

  this.collectionsContainer = $('.collections');
  this.collectionForm = $('.add-collection-form');
  this.shareFB = $('.share-fb');
  this.shareTW = $('.share-tw');

  this.viewer = new APP.Viewer('action', $('.feed-inner'), 'infinite', actions);

  new Clipboard('.copy', {
    text: this.copyHandler.bind(this)
  });
};

APP.FeedScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.saveBtn.click(this.saveClickHandler.bind(this));

  var collectionsUrl = DataApp.currentUser.url + '/collection/all';
  this.requestHandler(collectionsUrl, {
    meta: 'works'
  }, this.collectionsHandlerComplete);

  this.collectionForm.submit(this.collectionFormHandler.bind(this));

  var addCollectionHandler = this.addCollectionHandler.bind(this);
  Broadcaster.addEventListener(Events.ADD_COLLECTION, addCollectionHandler);

  var feedShareHandler = this.feedShareHandler.bind(this);
  Broadcaster.addEventListener(Events.SHARE, feedShareHandler);

  this.shareFB.click(this.shareFBHandler.bind(this));
  this.shareTW.click(this.shareTWHandler.bind(this));
};


APP.FeedScreen.prototype.copyHandler = function(trigger) {
  $('#lean_overlay').trigger("click");
  this.showFlash('succes', 'Link Copiado');
  return DataApp.baseUrl + 'user/' + this.currentWork.User.username +
    '/work/' + this.currentWork.nameSlugify;
};


APP.FeedScreen.prototype.feedShareHandler = function(event) {
  this.currentWork = event.data.work;
};

APP.FeedScreen.prototype.shareFBHandler = function() {
  Utils.shareFBWork(this.currentWork);
};

APP.FeedScreen.prototype.shareTWHandler = function() {
  Utils.shareTWWork(this.currentWork);
};

APP.FeedScreen.prototype.collectionFormHandler = function(event) {
  event.preventDefault();
  var url = DataApp.currentUser.url + '/collection/create';
  this.requestHandler(url, $(event.target).serialize(), this.collectionFormComplete);
};

APP.FeedScreen.prototype.collectionFormComplete = function(response) {
  var item = new APP.CollectionItem(response.data.collection);
  item.addEventListener(Events.COLLECTION_ITEM_SELECTED, this.collectionItemSelected.bind(this));
  this.collections.push(item);
  this.collectionsContainer.append(item.view);
};

APP.FeedScreen.prototype.addCollectionHandler = function(event) {
  this.currentWork = event.data.work;
  var url = DataApp.currentUser.url + '/work/inside_collection';
  var payload = {
    idWork: this.currentWork.id
  };
  this.requestHandler(url, payload, this.insideCollectionHandler);
};

APP.FeedScreen.prototype.insideCollectionHandler = function(response) {
  var collections = response.data.collections;
  var i, j;
  for (i = 0; i < this.collections.length; i++)
    this.collections[i].view.removeClass('selected');

  this.idCollections = [];
  for (i = 0; i < collections.length; i++) {
    for (j = 0; j < this.collections.length; j++) {
      if (collections[i].id === this.collections[j].data.id) {
        this.idCollections.push(collections[i].id);
        this.collections[j].view.addClass('selected');
      }
    }
  }
};

APP.FeedScreen.prototype.saveClickHandler = function() {
  this.saveBtn.hide();
  this.saveBtnLoading.show();

  var url = DataApp.currentUser.url + '/work/add_to_collection';
  var payload = {
    collections: JSON.stringify(this.idCollections),
    idWork: this.currentWork.id
  };
  this.requestHandler(url, payload, this.saveRequestComplete);
};

APP.FeedScreen.prototype.saveRequestComplete = function() {
  this.saveBtn.show();
  this.saveBtnLoading.hide();
  this.showFlash('succes', 'Su actualizo tus colecciones');

  $('#lean_overlay').trigger('click');
};

APP.FeedScreen.prototype.collectionsHandlerComplete = function(response) {
  var collections = response.data.collections;
  var i, item;
  for (i = 0; i < collections.length; i++) {
    item = new APP.CollectionItem(collections[i]);
    this.collections.push(item);
    item.addEventListener(Events.COLLECTION_ITEM_SELECTED, this.collectionItemSelected.bind(this));
    this.collectionsContainer.append(item.view);
  }
};

APP.FeedScreen.prototype.collectionItemSelected = function(event) {
  var item = event.target;
  var index = this.idCollections.indexOf(item.data.id);
  if (index === -1)
    this.idCollections.push(item.data.id);
  else
    this.idCollections.splice(index, 1);
};