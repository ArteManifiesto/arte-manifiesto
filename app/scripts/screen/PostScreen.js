/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PostScreen = function () {
  APP.BaseScreen.call(this, 'post');
};

APP.PostScreen.constructor = APP.PostScreen;
APP.PostScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.PostScreen.prototype.setupUI = function() {
  this.viewer = new APP.Viewer('post', $('.blog-articles-container'), null, posts);

  this.editor = new MediumEditor('.editable', {
      buttonLabels: 'fontawesome',
      toolbar: false,
      spellcheck: false,
      disableEditing: true
  });

  this.reviewContainer = $('.reviews-items-container');
  for (var i = 0; i <reviews.length; i++)
    this.reviewContainer.append(new APP.Review(reviews[i]).view);

  this.reviewForm = $('.review-form');
};

APP.PostScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.reviewForm.submit(this.reviewFormHandler.bind(this));
};

APP.PostScreen.prototype.reviewFormHandler = function(event) {
  event.preventDefault();
  var url = '/post/review/create';
  this.requestHandler(url, $(event.target).serialize(), this.reviewComplete);
};

APP.PostScreen.prototype.reviewComplete = function(response) {
  $('.value-input').val('');
  this.reviewContainer.append(new APP.Review(response.data.review).view);
}
