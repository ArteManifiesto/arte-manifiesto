/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.ChapterScreen = function() {
  APP.BaseScreen.call(this, 'chapter');
};

APP.ChapterScreen.constructor = APP.ChapterScreen;
APP.ChapterScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.ChapterScreen.prototype.setupUI = function() {
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
};


APP.ChapterScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);

  this.reviewForm.submit(this.reviewFormHandler.bind(this));
  this.loginReview.click(this.loginReviewHandler.bind(this));
  this.shareFb.click(this.shareFBHandler.bind(this));
  this.shareTw.click(this.shareTWHandler.bind(this));
};

APP.ChapterScreen.prototype.shareFBHandler = function() {
  Utils.shareFBPost(chapter);
};

APP.ChapterScreen.prototype.shareTWHandler = function() {
  Utils.shareTWPost(chapter);
};

APP.ChapterScreen.prototype.loginReviewHandler = function() {
  Utils.checkAuthentication();
};

APP.ChapterScreen.prototype.reviewFormHandler = function(event) {
  event.preventDefault();
  var url = '/tv/chapter/review/create';
  this.requestHandler(url, $(event.target).serialize(), this.reviewComplete);
};

APP.ChapterScreen.prototype.reviewComplete = function(response) {
  $('.value-input').val('');
  this.reviewContainer.append(new APP.Review(response.data.review).view);
};