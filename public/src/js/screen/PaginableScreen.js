/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.PaginableScreen = function (type) {
    this.type = type || 'numbers';
    this.url = '';
    this.container;
    this.currentPage = 0;
    this.totalPages = 0;
    this.data = {};
    this.maxButtons = 7;
    this.currentPageData;
};

APP.PaginableScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.PaginableScreen.constructor = APP.PaginableScreen;

APP.PaginableScreen.prototype.gotoPage = function (next) {
    var scope = this;
    var nextPage = next || scope.currentPage + 1;

    if (this.currentPage === nextPage)return;
    if (this.currentPage === 0)this.currentPage = 1;

    scope.url = scope.url.replace('page-' + scope.currentPage, 'page-' + nextPage);

    return $.post(scope.url).then(function (data) {
        console.log(data);
        scope.currentPage = data.pagination.page;
        scope.totalPages = data.pagination.pages;

        if(scope.currentPage > data.pagination.pages)return;

        scope.data[scope.currentPage] = data;
        scope.currentPageData = data;

        scope.build();
        scope.makeButtons();
    });
}

APP.PaginableScreen.prototype.build = function () {

}
APP.PaginableScreen.prototype.makeButtons = function () {
    $('.content').remove();
    var numbers = this.generateNumbers();
    var i, number, pNumber, content = $('<div>', {class: 'content'});
    for (i = 0; i < numbers.length; i++) {
        number = numbers[i];
        pNumber = $('<a>').text(number);
        pNumber.css('padding', '10px');
        if (number === this.currentPage)
            pNumber.css('color', '#ff0000');
        content.append(pNumber);
    }
    this.container.append(content);
}

APP.PaginableScreen.prototype.generateNumbers = function () {
    var i, result = [1], middle = Math.floor(this.maxButtons / 2);

    if (this.currentPage > this.totalPages)
        return null;

    if (this.totalPages < this.maxButtons) {
        for (i = 2; i < this.totalPages + 1; i++)
            result.push(i);
        return result;
    }

    if (this.currentPage <= middle && this.currentPage > 0)
        for (i = 2; i < this.maxButtons; i++)
            result.push(i);

    var maxLimit = (this.totalPages - middle);

    if (this.currentPage > middle && this.currentPage < maxLimit) {
        var steps = ((this.maxButtons - 3) / 2);
        for (i = this.currentPage - steps; i < this.currentPage + steps + 1; i++)
            result.push(i);
    }

    if (this.currentPage >= maxLimit && this.currentPage <= this.totalPages) {
        for (i = (this.totalPages - (this.maxButtons - 2) ); i < this.totalPages; i++)
            result.push(i);
    }

    result.push(this.totalPages);
    return result;
}