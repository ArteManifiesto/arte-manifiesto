/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.InfiniteNavigation = function () {
    this.currentPage = 0;
    this.totalPages = 0;

    this.maxButtons = 7;

    this.pagesCache = {};
    this.currentPageData;

    this.listeners();
};

APP.InfiniteNavigation.prototype = Object.create(APP.BaseNavigation.prototype);

APP.InfiniteNavigation.constructor = APP.InfiniteNavigation;

APP.InfiniteNavigation.prototype.listeners = function () {
    if (this.navigation === APP.InfiniteNavigation.NAVIGATION_PAGINATION)
        $(document).on('click', '.np-page-button', this.pagesHandler.bind(this));
};

APP.InfiniteNavigation.prototype.pagesHandler = function (event) {
    event.preventDefault();
    var buttonPage = $(event.currentTarget).attr('id');
    this.gotoPage(buttonPage);
};

APP.InfiniteNavigation.prototype.gotoPage = function (next) {
    var nextPage = next || this.currentPage + 1;

    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;

    this.url = this.getUrlOfNewPage(nextPage);

    if (this.pagesCache[nextPage])
        return this.afterGetData(this.pagesCache[nextPage]);

    this.getData({url: this.url}).done(this.afterGetData.bind(this));
};

APP.InfiniteNavigation.prototype.afterGetData = function (response) {
    this.currentPage = response.pagination.page;
    this.totalPages = response.pagination.pages;

    if (this.currentPage > response.pagination.pages)return;

    this.pagesCache[this.currentPage] = response;
    this.currentPageData = response;

    this.build();
}

APP.InfiniteNavigation.prototype.build = function () {
    if (this.navigation === APP.InfiniteNavigation.NAVIGATION_PAGINATION)
        this.makeButtons();
};

APP.InfiniteNavigation.prototype.makeButtons = function () {
    var numbers = Utils.paginationButtons(this.currentPage, this.totalPages, this.maxButtons);
    //TODO make buttons view
};

APP.InfiniteNavigation.prototype.getUrlOfNewPage = function (newPage) {
    return this.url.replace('page-' + this.currentPage, 'page-' + newPage);
};

APP.InfiniteNavigation.prototype.clean = function () {

};
