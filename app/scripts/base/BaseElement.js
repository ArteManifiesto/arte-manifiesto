/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.BaseElement = function (data, id) {
    this.template = APP.TemplateManager.instance.getFromDoc(id);
    this.data = data;
    var viewHelpers = {
      addFilter: function(url, filter) {
        return url.replace('upload/', 'upload/' + filter +'/');
      },
      formatDate: function(date){
        return moment(date).fromNow();
      },
      viewer: DataApp.currentUser
    };
    _.extend(this.data, viewHelpers);

    this.view = $(this.template(this.data));
    this.rawView = this.view[0];
    this.listeners();
};

APP.BaseElement.prototype = Object.create(Object.prototype);

APP.BaseElement.constructor = APP.BaseElement;

APP.BaseElement.prototype.listeners = function () {

};

APP.BaseElement.prototype.callToApi = function (params) {
    return APP.RestClientManager.instance.execute(params);
}

APP.BaseElement.prototype.isLogged = function () {
    if (!DataApp.currentUser)
        location.href = DataApp.loginRedirect;
    return DataApp.currentUser !== null;
};
