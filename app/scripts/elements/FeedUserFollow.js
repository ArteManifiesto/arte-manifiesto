/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.FeedUserFollow = function (data, options) {
  var friends = data.element.friends;
  if(friends.length > 0) {
    data.element.currentFriend = friends[_.random(0, friends.length - 1)];
  }else {
    data.element.currentFriend = null;
  }
  APP.BaseElement.call(this, data, 'feed-user-follow', options);
};

APP.FeedUserFollow.prototype = Object.create(APP.BaseElement.prototype);

APP.FeedUserFollow.constructor = APP.FeedUserFollow;

APP.FeedUserFollow.prototype.listeners = function() {
  this.followBtn = this.view.find('.am-Follow-button');
  this.followBtn.click(this.followClickHandler.bind(this));
}

APP.FeedUserFollow.prototype.followClickHandler = function() {
  var scope = this;
  if(this.data.element.following) {
    var url = DataApp.currentUser.url + '/unfollow/';
    $.post(url,{idUser: this.data.element.id}, function (response) {
      if(response.status === 200) {
        scope.data.element.following = false;
        $('.am-Follow-button').removeClass('following').text('+Seguir');
      }
    });
  }else {
    var url = DataApp.currentUser.url + '/follow/';
    $.post(url,{idUser: this.data.element.id}, function (response) {
      if(response.status === 200) {
        scope.data.element.following = true;
        $('.am-Follow-button').addClass('following').text('Siguiendo');
      }
    });
  }
  console.log('following');
}
