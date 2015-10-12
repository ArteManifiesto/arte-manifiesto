/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PaginableNavigation = function () {
    this.maxButtons = 7;

    this.pagesCache = {};
    this.currentPageData;

    this.listeners();
};

APP.PaginableNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.PaginableNavigation.constructor = APP.PaginableNavigation;

APP.PaginableNavigation.prototype.listeners = function () {
    if (this.navigation === APP.PaginableNavigation.NAVIGATION_PAGINATION)
        $(document).on('click', '.np-page-button', this.pagesHandler.bind(this));
};

APP.PaginableNavigation.prototype.pagesHandler = function (event) {
    event.preventDefault();
    var buttonPage = $(event.currentTarget).attr('id');
    this.gotoPage(buttonPage);
};

APP.PaginableNavigation.prototype.gotoPage = function (next) {
    var nextPage = next || this.currentPage + 1;

    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;

    this.newPageUrl(nextPage);

    if (this.pagesCache[nextPage])
        return this.afterGetData(this.pagesCache[nextPage]);

    Utils.getData({url: DataApp.currentUrl}).done(this.afterGetData.bind(this));
};

APP.PaginableNavigation.prototype.afterGetData = function (response) {
    console.log(response);
    this.currentPage = response.pagination.page;
    this.totalPages = response.pagination.pages;

    if (this.currentPage > response.pagination.pages)return;

    this.pagesCache[this.currentPage] = response;
    this.currentPageData = response;
    
    this.build();
}

APP.PaginableNavigation.prototype.build = function () {
    if (this.navigation === APP.PaginableNavigation.NAVIGATION_PAGINATION)
        this.makeButtons();
};

APP.PaginableNavigation.prototype.makeButtons = function () {
    var numbers = Utils.paginationButtons(this.currentPage, this.totalPages, this.maxButtons);
    console.log(numbers);
    //TODO make buttons view
};
