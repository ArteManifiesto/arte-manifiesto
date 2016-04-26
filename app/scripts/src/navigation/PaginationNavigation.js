/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PaginationNavigation = function() {
  this.maxButtons = 6;
  APP.BaseNavigation.call(this);
};

APP.PaginationNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.PaginationNavigation.constructor = APP.PaginationNavigation;

APP.PaginationNavigation.prototype.start = function() {
  this.makeButtons();
};

APP.PaginationNavigation.prototype.listeners = function() {
  $(document).on('click', '.np-page-button', this.pagesHandler.bind(this));
};

APP.PaginationNavigation.prototype.pagesHandler = function(event) {
  event.preventDefault();
  var buttonPage = $(event.currentTarget).attr('id');
  this.gotoPage(buttonPage);
};

APP.PaginationNavigation.prototype.build = function() {
  this.makeButtons();
};

APP.PaginationNavigation.prototype.makeButtons = function() {
  $('.am-Pagination').empty();
  var numbers = Utils.paginationButtons(this.currentPage, this.totalPages, this.maxButtons);
  if (numbers) {
    var i = 0;
    for (i; i < numbers.length; i++) {
      var link = DataApp.currentUrl.replace('page-' + +this.currentPage, 'page-' + numbers[i]);
      var view = $('<li style="display:inline-block;margin:10px;"><a class="np-page-button" href="' + link + '">' + numbers[i] + '</a></li>');
      $('.am-Pagination').append(view);
    }
  }
};