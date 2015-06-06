/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.WorksScreen = function () {
    APP.PaginableScreen.call(this, 'works', APP.PaginableScreen.NAVIGATION_PAGINATION);

    this.url = DataApp.searchWorks;
};

APP.WorksScreen.prototype = Object.create(APP.PaginableScreen.prototype);

APP.WorksScreen.constructor = APP.WorksScreen;

APP.WorksScreen.prototype.build = function () {
    APP.PaginableScreen.prototype.build.call(this);

    if (this.navigation === APP.PaginableScreen.NAVIGATION_PAGINATION)
        this.clean();

    var i, work;
    for (i = 0; i < this.currentPageData.works.length; i++) {
        this.currentPageData.works[i].index = i + 1;
        work = new APP.Work(this.currentPageData.works[i]);
        salvattore.appendElements(this.rawContainer, [work.rawView]);
    }
};

APP.WorksScreen.prototype.clean = function () {
    $('.work').remove();
};