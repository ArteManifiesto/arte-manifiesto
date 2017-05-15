/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.ProductScreen = function() {
  APP.BaseScreen.call(this, 'product');

  this.currentItem = this.oldItem;
  this.currentSection, this.oldSection;
  this.collections = [];
  this.idCollections = [];

  this.following = false;
};

APP.ProductScreen.constructor = APP.ProductScreen;
APP.ProductScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.ProductScreen.prototype.setupUI = function() {

  new APP.Viewer('carrouselItem', $('.more'), null, more);
  new APP.Viewer('carrouselItem', $('.similar'), null, similar);

  new APP.Carrousel($('.js-more-carousel'), $('.more'));
  new APP.Carrousel($('.js-similar-carousel'), $('.similar'));

  new APP.PhotoSwipe('{"tag":"product", "selector":"#productS-image"}');
  new APP.PhotoSwipe('{"tag":"product", "selector":"#product-image"}');
  new APP.PhotoSwipe('{"tag":"work", "selector":"#work-image"}');

  this.reviewsContainer = $('.reviews-items-container');
  for (var i = 0; i < reviews.length; i++)
    this.reviewsContainer.append(new APP.Review(reviews[i]).view);

  this.shareFb = $('.share-fb');
  this.buyBtn = $('.buy-product');
  this.category = $('select[name=model]');
  this.askBtn = $('.ask-availability');
  this.loginReview = $('.login-review');
  this.askRequester = $('.ask-requester');
  this.thanksRequester = $('.thanks-requester');
  this.likeBtn = $('.like-btn');
  this.flavor = Utils.getUrlParameter('size');
  this.afterLike = $('.after-like');
  this.saveBtn = $('.save-collections');
  this.saveBtnLoading = $('.save-collections-loading');
  this.followBtn = $('.am-Follow-button');
  this.collectionsContainer = $('.collections');
  this.collectionForm = $('.add-collection-form');
  this.reviewForm = $('.review-form');
  this.reviewContainer = $('.reviews-items-container');

  new Clipboard('.copy', {
    text: this.copyHandler.bind(this)
  });

  if (this.flavor !== undefined){
    this.category.find('option[value="' + this.flavor + '"]').prop("selected", "selected");
  }
}

APP.ProductScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.shareFb.click(this.shareFBHandler.bind(this));

  $('.menu-item').click(this.menuItemHandler.bind(this));
  $('.menu-item[data-name=' + currentPath + ']').click();

  this.loginReview.click(this.loginReviewHandler.bind(this));
  this.saveBtn.click(this.saveClickHandler.bind(this));
  if (DataApp.currentUser) {
    var collectionsUrl = DataApp.currentUser.url + '/collection/all';
    this.requestHandler(collectionsUrl, {
      meta: 'products'
    }, this.collectionsHandlerComplete);

    if (!owner) {
      var followingUrl = DataApp.currentUser.url + '/isFollowing';
      this.requestHandler(followingUrl, {
        idUser: product.User.id
      }, this.isFollowingComplete);
    }
  }

  this.category.change(this.categoryHandler.bind(this));

  this.likeBtn.click(this.likeBtnHandler.bind(this));

  this.followBtn.click(this.followHandler.bind(this));
  this.collectionForm.submit(this.collectionFormHandler.bind(this));
  this.reviewForm.submit(this.reviewFormHandler.bind(this));

};


APP.ProductScreen.prototype.copyHandler = function(trigger) {
  $('#lean_overlay').trigger("click");
  this.showFlash('succes', 'Link Copiado');
  return window.location.href;
};

APP.ProductScreen.prototype.categoryHandler = function(event) {
  if($.isNumeric(this.category.find(':selected').val())){
    Cookies.set('size_product', this.category.find(':selected').text(), {
      maxAge: 3600000,
      domain: '.' + document.domain
    });
  }
  else {
    window.location.href = this.category.find(':selected').val();
  }
};

APP.ProductScreen.prototype.reviewFormHandler = function(event) {
  event.preventDefault();
  var url = DataApp.currentUser.url + '/product/review/create';
  this.requestHandler(url, $(event.target).serialize(), this.reviewComplete);
};

APP.ProductScreen.prototype.reviewComplete = function(response) {
  $('.value-input').val('');
  this.reviewContainer.append(new APP.Review(response.data.review).view);
}


APP.ProductScreen.prototype.followHandler = function() {
  Utils.checkAuthentication();
  var url = DataApp.currentUser.url + (this.isFollowing ? '/unfollow/' : '/follow/');
  this.requestHandler(url, {
    idUser: product.User.id
  }, this.followComplete);
};

APP.ProductScreen.prototype.followComplete = function(response) {
  console.log(response);
  if (this.isFollowing) {
    this.followBtn.removeClass('following').text('+ SEGUIR');
  } else {
    this.followBtn.addClass('following').text('Siguiendo');
  }

  this.isFollowing = !this.isFollowing;
}

APP.ProductScreen.prototype.isFollowingComplete = function(response) {
  this.isFollowing = response.data.following;
  this.isFollowing && this.followBtn.addClass('following').text('Siguiendo');
}

APP.ProductScreen.prototype.saveClickHandler = function() {
  this.saveBtn.hide();
  this.saveBtnLoading.show();

  var url = DataApp.currentUser.url + '/product/add_to_collection';
  var payload = {
    collections: JSON.stringify(this.idCollections),
    idProduct: product.id
  };
  this.requestHandler(url, payload, this.saveRequestComplete);
};

APP.ProductScreen.prototype.saveRequestComplete = function() {
  this.saveBtn.show();
  this.saveBtnLoading.hide();
  this.showFlash('succes', 'Su actualizo tus colecciones');

  $('#lean_overlay').trigger('click');
};


APP.ProductScreen.prototype.collectionFormHandler = function(event) {
  event.preventDefault();
  var url = DataApp.currentUser.url + '/collection/create';
  this.requestHandler(url, $(event.target).serialize(), this.collectionFormComplete);
};

APP.ProductScreen.prototype.collectionFormComplete = function(response) {
  var item = new APP.CollectionItem(response.data.collection);
  item.addEventListener(Events.COLLECTION_ITEM_SELECTED, this.collectionItemSelected.bind(this));
  this.collections.push(item);
  this.collectionsContainer.append(item.view);
};


APP.ProductScreen.prototype.likeBtnHandler = function() {
  Utils.checkAuthentication();
  if (!product.liked) {
    var url = DataApp.currentUser.url + '/product/like';
    this.requestHandler(url, {
      idProduct: product.id
    }, this.likeComplete);
  }
};

APP.ProductScreen.prototype.likeComplete = function(response) {
  product.liked = !product.liked;
  $('.likes').text(response.data.likes);
  this.likeBtn.parent().addClass('active');
  this.afterLike.show();
};

APP.ProductScreen.prototype.collectionsHandlerComplete = function(response) {
  var collections = response.data.collections;
  var i, item;
  for (i = 0; i < collections.length; i++) {
    item = new APP.CollectionItem(collections[i]);
    this.collections.push(item);
    item.addEventListener(Events.COLLECTION_ITEM_SELECTED, this.collectionItemSelected.bind(this));
    this.collectionsContainer.append(item.view);
  }

  var url = DataApp.currentUser.url + '/product/inside_collection';
  this.requestHandler(url, {
    idProduct: product.id
  }, this.insideCollectionHandler);
};

APP.ProductScreen.prototype.insideCollectionHandler = function(response) {
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

APP.ProductScreen.prototype.collectionItemSelected = function(event) {
  var item = event.target;
  var index = this.idCollections.indexOf(item.data.id);
  if (index === -1)
    this.idCollections.push(item.data.id);
  else
    this.idCollections.splice(index, 1);
};

APP.ProductScreen.prototype.loginReviewHandler = function() {
  Utils.checkAuthentication();
};

APP.ProductScreen.prototype.menuItemHandler = function(event) {
  this.currentItem = $(event.currentTarget);
  var path = this.currentItem.data('name');
  this.currentSection = $('.' + path + '-container');
  this.currentSection.show();
  var url = '/user/' + product.User.username + '/product/' + product.nameSlugify +
    '/' + (path === 'index' ? '' : path);

  $('.menu-item').removeClass('selected');
  this.currentItem.addClass('selected');
  this.oldSection && this.oldSection.hide();
  this.oldSection = this.currentSection;
  Utils.changeUrl(DataApp.baseTitle + Utils.capitalize(path), url);
};

APP.ProductScreen.prototype.shareFBHandler = function() {
  Utils.shareFBProduct(product);
};