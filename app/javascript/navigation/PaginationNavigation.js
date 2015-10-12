/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PaginationNavigation = function () {
  this.maxButtons = 6;
  APP.BaseNavigation.call(this);
};

APP.PaginationNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.PaginationNavigation.constructor = APP.PaginationNavigation;

APP.PaginationNavigation.prototype.listeners = function () {
  $(document).on('click', '.np-page-button', this.pagesHandler.bind(this));
};

APP.PaginationNavigation.prototype.pagesHandler = function (event) {
    event.preventDefault();
    var buttonPage = $(event.currentTarget).attr('id');
    this.gotoPage(buttonPage);
};

APP.PaginationNavigation.prototype.build = function () {
    this.makeButtons();
};

APP.PaginationNavigation.prototype.makeButtons = function () {
    var numbers = Utils.paginationButtons(this.currentPage, this.totalPages, this.maxButtons);
    var i = 0;
    for (i; i < numbers.length; i++) {
      console.log(i);
      var view = $('<li><a>'+ numbers[i] +'</a></li>');
      $('.am-Pagination').append(view);
    }
};
