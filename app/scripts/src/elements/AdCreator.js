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

APP.AdCreator.prototype.updateData = function(data) {
  this.view.find('input[name=photo]').val(data.photo);
  this.view.find('input[name=description]').val(data.description);
  this.view.find('input[name=link]').val(data.link);
};

APP.AdCreator.prototype.getData = function() {
  var photo = this.view.find('input[name=photo]').val();
  var description = this.view.find('input[name=description]').val();
  var link = this.view.find('input[name=link]').val();
  var errors = [];

  if(Validations.notBlank(photo)) errors.push(1);
  if(Validations.notBlank(description)) errors.push(1);
  if(Validations.notBlank(link)) errors.push(1);

  if(errors.length > 0 ) return null;
  
	return {
    photo: photo,
    description: description,
    link: link,
    AdTypeId: this.data.id
	};
};