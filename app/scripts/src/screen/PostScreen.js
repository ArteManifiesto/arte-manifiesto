/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PostScreen = function () {
  APP.BaseScreen.call(this, 'post');

  this.following = false;
};

APP.PostScreen.constructor = APP.PostScreen;
APP.PostScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.PostScreen.prototype.setupUI = function () {
  this.viewer = new APP.Viewer('post', $('.blog-articles-container'), null, posts);
  this.loginReview = $('.login-review');
  this.followBtn = $('.following');
  this.shareFb = $('.share-fb');
  this.shareTw = $('.share-tw');

  this.editor = new MediumEditor('.editable', {
    buttonLabels: 'fontawesome',
    toolbar: false,
    spellcheck: false,
    disableEditing: true
  });

  this.reviewForm = $('.review-form');
  this.reviewContainer = $('.reviews-items-container');
  for (var i = 0; i < reviews.length; i++)
    this.reviewContainer.append(new APP.Review(reviews[i]).view);

  this.likeBtn = $('.like-btn');

  if (DataApp.currentUser) {
    if (DataApp.currentUser.id === post.User.id)
      return this.followBtn.hide();

    var followingUrl = DataApp.currentUser.url + '/isFollowing';
    this.requestHandler(followingUrl, {idUser: post.User.id}, this.isFollowingComplete);
  }
};


APP.PostScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.reviewForm.submit(this.reviewFormHandler.bind(this));
  this.likeBtn.click(this.likeBtnHandler.bind(this));
  this.loginReview.click(this.loginReviewHandler.bind(this));
  this.followBtn.click(this.followHandler.bind(this));
  this.shareFb.click(this.shareFBHandler.bind(this));
  this.shareTw.click(this.shareTWHandler.bind(this));
};

APP.PostScreen.prototype.shareFBHandler = function () {
  Utils.shareFBPost(post);
};
APP.PostScreen.prototype.shareTWHandler = function () {
  Utils.shareTWPost(post);
};

APP.PostScreen.prototype.followHandler = function() {
  Utils.checkAuthentication();
  var url = DataApp.currentUser.url + (this.isFollowing ? '/unfollow/' : '/follow/');
  this.requestHandler(url, {idUser: post.User.id}, this.followComplete);
};

APP.PostScreen.prototype.followComplete = function(response) {
  if(this.isFollowing) {
    this.followBtn.removeClass('following').text('+ SEGUIR');
  } else {
    this.followBtn.addClass('following').text('Siguiendo');
  }
  this.isFollowing = !this.isFollowing;
};

APP.PostScreen.prototype.likeBtnHandler = function (event) {
  event.preventDefault();
  Utils.checkAuthentication();

  if (!post.liked) {
    var url = '/blog/post/like';
    this.requestHandler(url, {idPost: post.id}, this.likeComplete);
  }
};

APP.PostScreen.prototype.loginReviewHandler = function () {
  Utils.checkAuthentication();
};

APP.PostScreen.prototype.isFollowingComplete = function (response) {
  this.isFollowing = response.data.following;
  this.isFollowing && this.followBtn.addClass('following').text('Siguiendo');
};

APP.PostScreen.prototype.likeComplete = function (response) {
  post.liked = !post.liked;
  $('.likes').text(response.data.likes);
  this.likeBtn.addClass('liked');
};


APP.PostScreen.prototype.reviewFormHandler = function (event) {
  event.preventDefault();
  var url = '/blog/post/review/create';
  this.requestHandler(url, $(event.target).serialize(), this.reviewComplete);
};

APP.PostScreen.prototype.reviewComplete = function (response) {
  $('.value-input').val('');
  this.reviewContainer.append(new APP.Review(response.data.review).view);
};
