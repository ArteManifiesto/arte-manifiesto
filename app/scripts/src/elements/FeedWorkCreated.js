/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.FeedWorkCreated = function(data, options) {
  APP.BaseElement.call(this, data, 'feed-work-created', options);
};

APP.FeedWorkCreated.prototype = Object.create(APP.BaseElement.prototype);

APP.FeedWorkCreated.constructor = APP.FeedWorkCreated;
APP.FeedWorkCreated.prototype.listeners = function() {
  this.addCollectionBtn = this.view.find('.add-collection');
  this.likeBtn = this.view.find('.like');
  this.shareBtn = this.view.find('.share');
  this.afterLike = this.view.find('.after-like');
  this.followBtn = this.view.find('.am-Follow-button');

  if (this.data.element.User.following) {
    this.followBtn.addClass('following').text('Siguiendo');
  }
  this.addCollectionBtn.click(this.addCollectionHandler.bind(this));
  this.likeBtn.click(this.likeHandler.bind(this));
  this.shareBtn.click(this.shareHandler.bind(this));
  this.followBtn.click(this.followHandler.bind(this));
};

APP.FeedWorkCreated.prototype.addCollectionHandler = function() {
  $('#go-collection-modal').click();
  Broadcaster.dispatchEvent(Events.ADD_COLLECTION, {
    data: {
      work: this.data.element
    }
  });
};

APP.FeedWorkCreated.prototype.likeHandler = function() {
  if(DataApp.currentUser){
    if (!this.likeBtn.hasClass('active')) {
      var url = DataApp.currentUser.url + '/work/like';
      var scope = this;
      $.post(url, {
        idWork: this.data.element.id
      }, function(response) {
        if (response.status === 200) {
          scope.likeBtn.addClass('active');
          scope.afterLike.show();
        }
      });
    }
  }
  else{
      event.preventDefault();
      Utils.checkAuthentication();
  }
};

APP.FeedWorkCreated.prototype.shareHandler = function() {
  if(DataApp.currentUser){
    $('#go-share-modal').click();
    Broadcaster.dispatchEvent(Events.SHARE, {
      data: {
        work: this.data.element
      }
    });
  }
  else{
      event.preventDefault();
      Utils.checkAuthentication();
  }
};

APP.FeedWorkCreated.prototype.followHandler = function() {
  var scope = this;
  if (this.data.element.User.following) {
    var url = DataApp.currentUser.url + '/unfollow/';
    $.post(url, {
      idUser: this.data.element.User.id
    }, function(response) {
      if (response.status === 200) {
        scope.data.element.User.following = false;
        $('.am-Follow-button').removeClass('following').text('+Seguir');
      }
    });
  } else {
    var url = DataApp.currentUser.url + '/follow/';
    $.post(url, {
      idUser: this.data.element.User.id
    }, function(response) {
      if (response.status === 200) {
        scope.data.element.User.following = true;
        $('.am-Follow-button').addClass('following').text('Siguiendo');
      }
    });
  }
};