/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.WorksScreen = function () {
    APP.PaginableScreen.call(this, 'numbers');

    this.container = $('.works')
    this.rawContainer = this.container[0];

    this.url = DataApp.searchWorks;
};

APP.WorksScreen.prototype = Object.create(APP.PaginableScreen.prototype);

APP.WorksScreen.constructor = APP.WorksScreen;

APP.WorksScreen.prototype.build = function () {
    if (this.type === 'numbers')
        $('.work').remove();

    var i, work;
    for (i = 0; i < this.currentPageData.works.length; i++) {
        this.currentPageData.works[i].index = i + 1;
        work = new APP.Work(this.currentPageData.works[i]);
        salvattore.appendElements(this.rawContainer, [work.rawView]);
    }
}