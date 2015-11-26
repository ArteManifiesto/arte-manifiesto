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
