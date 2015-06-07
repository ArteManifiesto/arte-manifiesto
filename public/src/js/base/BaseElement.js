/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.BaseElement = function (data, id) {
    this.template = _.template(APP.TemplateManager.instance.templates[id]);
    this.data = data;
    this.view = $(this.template(this.data));
    this.rawView = this.view[0];

    this.setupUI();
    this.listeners();
};

APP.BaseElement.prototype = Object.create(Object.prototype);

APP.BaseElement.constructor = APP.BaseElement;

APP.BaseElement.prototype.setupUI = function () {

}


APP.BaseElement.prototype.listeners = function () {

};

APP.BaseElement.prototype.gotoSingle = function () {
    location.href = this.data.url;
};

APP.BaseElement.prototype.callToApi = function (params) {
    return APP.RestClientManager.instance.execute(params);
}

APP.BaseElement.prototype.checkLogged = function () {
    if (!user)
        return location.href = DataApp.loginRedirect;
}
