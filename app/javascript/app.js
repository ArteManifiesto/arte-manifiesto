/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AM = function () {
  new APP.RestClientManager();
  new APP.TemplateManager();

  var templates = ['work', 'product', 'user', 'collection', 'filter-item'];
  APP.TemplateManager.instance.loadTemplates(templates).done(function () {
     console.log('templates loaded');

     var filters = {
       categories: [{name: 'PAINTS'}, {name: 'DRAWS'}],
       orders: [{name: 'POPULARITY'}, {name: 'LIKES'}],
       currentCategory: 'all',
       currentOrder: 'popularity'
     };
     new APP.Viewer('works', 'pagination', filters);
  });
};

APP.AM.constructor = APP.AM;
