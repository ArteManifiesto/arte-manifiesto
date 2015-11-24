/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AddWorkScreen = function () {
  APP.BaseScreen.call(this, 'add-work');
  $('input[name=tags]').tagsInput({
		height:'50px', width:'100%', defaultText:'+ Etiqueta'
	});

	this.uploaderImage = new APP.UploaderImage($('.uploader-work'), function(idImage) {
		this.$view.find('.upload').show();
		$('.cloudinary-fileupload').show();
		$.cloudinary.image(idImage, {width: 300, crop:'limit'})
		.appendTo(this.$view.find('.preview'));
	});
};

APP.AddWorkScreen.constructor = APP.AddWorkScreen;
APP.AddWorkScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AddWorkScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);
  $('.work-form').submit(this.workFormSubmitHandler.bind(this));
  $('.work-delete').click(this.workDeleteHandler.bind(this));
};

APP.AddWorkScreen.prototype.workFormSubmitHandler = function(event) {
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

  var url = DataApp.currentUser.url + '/work/create';
  var payload = {
    photo: photo,
    name: $('input[name=name]').val(),
    idCategory: parseInt($('select[name=category]').val(), 10),
    tags: tags,
    description: $('textarea[name=description]').val(),
    public: $('input[name=public]:checked').val() !== undefined
  };
  this.requestHandler(url, payload, this.workCreatedComplete);
};

APP.AddWorkScreen.prototype.workCreatedComplete = function(response) {
  console.log(this);
  $('.send').show();
  $('.send-loading').hide();
  this.showFlash('succes', 'Su obra se subió exitosamente')
  var work = response.data.work;
  $('.work-form').hide();
  var workUrl = DataApp.currentUser.url + '/work/' + work.nameSlugify
  $('.work-view').attr('href', workUrl);
  $('.work-new').attr('href', DataApp.currentUser.url + '/work/add');
  $('.work-edit').attr('href', workUrl + '/edit');
  $('.work-photo-published').attr('src', Utils.addImageFilter(work.photo, 'w_300,c_limit'));
  $('.work-name-published').text(work.name);
  $('.work-user-published').text(DataApp.currentUser.fullname);
  $('.work-published').show();
}

APP.AddWorkScreen.prototype.workDeleteHandler = function(event) {
  event.preventDefault();
  var url = DataApp.currentUser.url + '/work/delete';
  this.requestHandler(url, {idWork: work.id}, this.workDeleteComplete);
}

APP.AddWorkScreen.prototype.workDeleteComplete = function (response) {
  this.showFlash('success', 'Su obra se elimino exitosamente');
  window.location.href =  DataApp.currentUser.url;
}
