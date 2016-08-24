/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdCreator = function(data, options) {
  APP.BaseElement.call(this, data, 'ad-creator', options);
};

APP.AdCreator.prototype = Object.create(APP.BaseElement.prototype);

APP.AdCreator.constructor = APP.AdCreator;

APP.AdCreator.prototype.listeners = function() {
  // this.view.click(this.clickViewHandler.bind(this));
};

APP.AdCreator.prototype.clickViewHandler = function() {
  // this.view.toggleClass('selected');
  // this.dispatchEvent({
  //   type: Events.COLLECTION_ITEM_SELECTED
  // });
};


APP.AdCreator.prototype.getData = function() {
	return {
		photo: this.view.find('input[name=photo]').val(),
		description: this.view.find('input[name=description]').val(),
		link: this.view.find('input[name=link]').val()
	};
};