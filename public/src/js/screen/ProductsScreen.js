/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.ProductsScreen = function (data) {
    APP.PaginableScreen.call(this);
    
    this.url = DataApp.searchProducts;
};

APP.ProductsScreen.prototype = Object.create(APP.PaginableScreen.prototype);

APP.ProductsScreen.constructor = APP.ProductsScreen;