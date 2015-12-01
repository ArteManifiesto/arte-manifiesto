/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.EditWorkScreen = function () {
  APP.BaseScreen.call(this, 'add-work');
  $('input[name=tags]').tagsInput({
		height:'50px', width:'100%', defaultText:'+ Etiqueta'
	});

  $('select[name=category]')
  .find('option[value=' + category.id + ']')
  .attr('selected', true);

  this.work = work;
	this.uploaderImage = new APP.UploaderImage($('.uploader-work'), function(idImage) {
		this.$view.find('.upload').show();
		$('.cloudinary-fileupload').show();
		$.cloudinary.image(idImage, {width: 300, crop:'limit'})
		.appendTo(this.$view.find('.preview'));
	});
  this.uploaderImage.photo = work.photo;
};

APP.EditWorkScreen.constructor = APP.EditWorkScreen;
APP.EditWorkScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.EditWorkScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
  $('.work-form').submit(this.workFormSubmitHandler.bind(this));
  $('.work-delete').click(this.workDeleteHandler.bind(this));
  $('.work-delete-force').click(this.workDeleteForceHandler.bind(this));
  $('.work-delete-cancel').click(this.workDeleteCancelHandler.bind(this));
  $('input[type=checkbox]').change(this.checkPublicHandler);
};

APP.AddWorkScreen.prototype.checkPublicHandler = function() {
  $(this).parent().find('.value').text((this.checked ? 'On' : 'Off'));
}

APP.EditWorkScreen.prototype.workFormSubmitHandler = function(event) {
  event.preventDefault();

  var tags = $('input[name=tags]').val();
  var photo = this.uploaderImage.photo;
  var errors = [];
  if(!photo)
    errors.push('agrega foto mierda T_T');

  if(tags.split(',')[0].length < 1)
    errors.push('agrega tags ctv');

  if(errors.length > 0)
    return this.showFlash('error', errors);

  $('.send').hide();
  $('.send-loading').show();

  var url = DataApp.currentUser.url + '/work/update';
  var payload = {
    idWork: work.id,
    photo: photo,
    name: $('input[name=name]').val(),
    idCategory: parseInt($('select[name=category]').val(), 10),
    tags: tags,
    description: $('textarea[name=description]').val(),
    public: $('input[name=public]:checked').val() !== undefined,
    nswf: $('input[name=nswf]:checked').val() !== undefined
  };
  this.requestHandler(url, payload, this.workCreatedComplete);
};

APP.EditWorkScreen.prototype.workCreatedComplete = function(response) {
  $('.send').show();
  $('.send-loading').hide();
  this.showFlash('succes', 'Su obra se actualizo exitosamente')
  this.work = response.data.work;
  var workUrl = DataApp.currentUser.url + '/work/' + work.nameSlugify + '/edit';
  Utils.changeUrl(work.name, workUrl);
};

APP.EditWorkScreen.prototype.workDeleteHandler = function(event) {
  event.preventDefault();
  $('.work-delete').hide();
  $('.work-delete-confirm').show();
};

APP.EditWorkScreen.prototype.workDeleteForceHandler = function(event) {
  event.preventDefault();
  var url = DataApp.currentUser.url + '/work/delete';
  this.requestHandler(url, {idWork: this.work.id}, this.workDeleteForceComplete);
};

APP.EditWorkScreen.prototype.workDeleteForceComplete = function (response) {
  window.location.href = DataApp.currentUser.url;
};

APP.EditWorkScreen.prototype.workDeleteCancelHandler = function (response) {
  $('.work-delete').show();
  $('.work-delete-confirm').hide();
};
