/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.TemplateManager = function () {
    APP.TemplateManager.instance = this;
    this.templates = {};
};

APP.TemplateManager.prototype = Object.create(Object.prototype);

APP.TemplateManager.constructor = APP.TemplateManager;

APP.TemplateManager.prototype.loadTemplates = function (ids) {
    var scope = this, i, deferreds = [];
    for (i = 0; i < ids.length; i++)
        deferreds.push($.get(DataApp.templatesUrl + ids[i] + ".html"));

    return $.when.apply(null, deferreds).done(function () {
        if (ids.length <= 1) return scope.templates[ids[0]] = arguments[0];
        for (i = 0; i < ids.length; i++)
            scope.templates[ids[i]] = _.template(arguments[i][0]);
    });
};

APP.TemplateManager.prototype.getFromDoc = function(id) {
  console.log('idddd');
  console.log('id : ' , id);
  if(this.templates[id])
    return this.templates[id];

  this.templates[id] = _.template($("#template-" + id).html());
  return this.templates[id];
};
