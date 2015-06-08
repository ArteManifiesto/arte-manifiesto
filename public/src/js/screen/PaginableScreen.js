/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PaginableScreen = function (id, navigation) {
    APP.BaseScreen.call(this, id);

    APP.PaginableScreen.NAVIGATION_PAGINATION = 'pagination';
    APP.PaginableScreen.NAVIGATION_INFINITE = 'infinite';

    this.navigation = navigation || APP.PaginableScreen.NAVIGATION_PAGINATION;

    this.container = $('.' + this.id);
    this.rawContainer = this.container[0];

    this.url;
    this.currentPage = 0;
    this.totalPages = 0;

    this.maxButtons = 7;

    this.pagesCache = {};
    this.currentPageData;

    this.listeners();
};

APP.PaginableScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.PaginableScreen.constructor = APP.PaginableScreen;

APP.PaginableScreen.prototype.listeners = function () {
    if (this.navigation === APP.PaginableScreen.NAVIGATION_PAGINATION)
        $(document).on('click', '.page-button', this.pagesHandler.bind(this));
};

APP.PaginableScreen.prototype.pagesHandler = function (event) {
    event.preventDefault();
    var buttonPage = $(event.currentTarget).attr('id');
    this.gotoPage(buttonPage);
};

APP.PaginableScreen.prototype.gotoPage = function (next) {
    var nextPage = next || this.currentPage + 1;

    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;

    this.url = this.getUrlOfNewPage(nextPage);

    if (this.pagesCache[nextPage])
        return this.afterGetData(this.pagesCache[nextPage]);

    this.getData({url: this.url}).done(this.afterGetData.bind(this));
};

APP.PaginableScreen.prototype.afterGetData = function (response) {
    this.currentPage = response.pagination.page;
    this.totalPages = response.pagination.pages;

    if (this.currentPage > response.pagination.pages)return;

    this.pagesCache[this.currentPage] = response;
    this.currentPageData = response;

    this.build();
}

APP.PaginableScreen.prototype.build = function () {
    if (this.navigation === APP.PaginableScreen.NAVIGATION_PAGINATION)
        this.makeButtons();
};

APP.PaginableScreen.prototype.makeButtons = function () {
    var numbers = Utils.paginationButtons(this.currentPage, this.totalPages,
        this.maxButtons);
    //TODO make buttons view
};

APP.PaginableScreen.prototype.getUrlOfNewPage = function (newPage) {
    return this.url.replace('page-' + this.currentPage, 'page-' + newPage);
};

APP.PaginableScreen.prototype.clean = function () {

};