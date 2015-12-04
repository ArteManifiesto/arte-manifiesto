/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.CollectionItem = function (data, options) {
    APP.BaseElement.call(this, data, 'collection-item', options);
};

APP.CollectionItem.prototype = Object.create(APP.BaseElement.prototype);

APP.CollectionItem.constructor = APP.CollectionItem;

APP.CollectionItem.prototype.listeners = function () {
  this.view.click(this.clickViewHandler.bind(this));
};

APP.CollectionItem.prototype.clickViewHandler = function() {
  this.view.toggleClass('selected');
  this.dispatchEvent({type: Events.COLLECTION_ITEM_SELECTED});
};
