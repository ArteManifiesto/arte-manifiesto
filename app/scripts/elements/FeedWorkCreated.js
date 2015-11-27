/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.FeedWorkCreated = function (data, options) {
  APP.BaseElement.call(this, data, 'feed-work-created', options);
};

APP.FeedWorkCreated.prototype = Object.create(APP.BaseElement.prototype);

APP.FeedWorkCreated.constructor = APP.FeedWorkCreated;
APP.FeedWorkCreated.prototype.listeners = function() {
  this.addCollectionBtn = this.view.find('.add-collection');
  this.likeBtn = this.view.find('.like');
  this.afterLike = this.view.find('.after-like');
  this.followBtn = this.view.find('.am-Follow-button');
  if(this.data.element.User.following) {
    this.followBtn.addClass('following').text('Siguiendo');
  }
  this.addCollectionBtn.click(this.addCollectionHandler.bind(this));
  this.likeBtn.click(this.likeHandler.bind(this));
  this.followBtn.click(this.followHandler.bind(this));
};

APP.FeedWorkCreated.prototype.addCollectionHandler = function() {
    $('#go-collection-modal').click();
    currentIdWork = this.data.element.id;
    var url = DataApp.currentUser.url + '/work/inside_collection';
    $.post(url,{idWork: this.data.element.id}, function (response) {
      var collectionsSelected = response.data.collections;
      for(var i= 0; i <collections.length; i++) {
        var id = collections[i].id;
        $('.collection[data-id='+ id +']').removeClass('selected');
      }
      for(var i= 0; i <collectionsSelected.length; i++) {
        var id = collectionsSelected[i].id;
        $('.collection[data-id='+ id +']').addClass('selected');
      }
    });
};

APP.FeedWorkCreated.prototype.likeHandler = function() {
    if(!this.likeBtn.hasClass('active')) {
      var url = DataApp.currentUser.url + '/work/like';
      var scope = this;
      $.post(url, {idWork: this.data.element.id}, function (response) {
        if(response.status === 200) {
          scope.likeBtn.addClass('active');
          scope.afterLike.show();
        }
      });
    }
};

APP.FeedWorkCreated.prototype.followHandler = function() {
  var scope = this;
  if(this.data.element.User.following) {
    var url = DataApp.currentUser.url + '/unfollow/';
    $.post(url,{idUser: this.data.element.User.id}, function (response) {
      if(response.status === 200) {
        scope.data.element.User.following = false;
        $('.am-Follow-button').removeClass('following').text('+Seguir');
      }
    });
  }else {
    var url = DataApp.currentUser.url + '/follow/';
    $.post(url,{idUser: this.data.element.User.id}, function (response) {
      if(response.status === 200) {
        scope.data.element.User.following = true;
        $('.am-Follow-button').addClass('following').text('Siguiendo');
      }
    });
  }
};
