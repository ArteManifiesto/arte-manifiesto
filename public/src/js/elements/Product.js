/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Product = function (data) {
    APP.BaseElement.call(this, data, 'product');
    this.liked = this.data.liked;
};

APP.Product.prototype = Object.create(APP.BaseElement.prototype);

APP.Product.constructor = APP.Product;

APP.Product.prototype.setupUI = function () {
    if (Utils.isMobile.any()) {
        /*
         this.likeBtn = this.view.find('.social-item');
         this.collectBtn = this.view.find('.social-item');
         */
    }
};

APP.Product.prototype.listeners = function () {/*
    this.likeBtn.click(this.likeToggle.bind(this));
    this.view.click(this.gotoSingle.bind(this));*/
};

APP.Product.prototype.likeToggle = function (event) {
    this.checkLogged();

    var params = {
        data: {idProduct: this.data.id},
        url: DataApp[!this.liked ? 'productLike' : 'productUnLike']
    };

    this.callToApi(params).done(this.afterLikeApi.bind(this));

    if (event.stopPropagation)
        event.stopPropagation();
};

APP.Product.prototype.afterLikeApi = function (data) {
    if (data.status === 200) {
        if (Utils.isMobile.any())
            this.likeBtn.toggleClass('fade');
        else
            this.likeBtn.toggleClass('active');
        this.liked = !this.liked;
    }
};