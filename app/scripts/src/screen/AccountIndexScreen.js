/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AccountIndexScreen = function() {
  APP.BaseScreen.call(this, 'accountIndex');

  this.timeout = null;
  this.isUserAvailable = true;
};

APP.AccountIndexScreen.constructor = APP.AccountIndexScreen;
APP.AccountIndexScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AccountIndexScreen.prototype.setupUI = function() {
  this.uploaderImage = new APP.UploaderImage($('.uploader-profile'), this.uploaderImageComplete);
  this.uploaderImage.photo = DataApp.currentUser.photo;

  this.save = $('.save');
  this.saveLoading = $('.save-loading');
  this.isArtist = $('input[name=isArtist]');
  this.firstname = $('input[name=firstname]');
  this.lastname = $('input[name=lastname]');
  this.pseudonimo = $('input[name=pseudonimo]');
  this.username = $('input[name=username]');
  this.gender = $('select[name=gender]');
  this.birthday = $('input[name=birthday]');
  this.country = $('select[name=country]');
  this.city = $('input[name=city]');
  this.biography = $('textarea[name=biography]');
  this.completeForm = $('.complete-form');
  this.artistData = $('.artist-data');
  this.gender.find('option:contains(' + DataApp.currentUser.gender + ')').attr("selected", true);
  this.country.find('option:contains(' + DataApp.currentUser.country + ')').attr("selected", true);
  this.typeName = $('select[name=typeName]');

  var isArtist = DataApp.currentUser.isArtist ? 1 : 0;

  $('input[name=isArtist][value=' + isArtist + ']').attr('checked', true);
  for (var i = 0; i < interests.length; i++)
    $('input[type=checkbox][value=' + interests[i].id + ']').attr('checked', true);

  this.typeName.val(DataApp.currentUser.typeName);

  $("#date").mask("99/99/9999");
}


APP.AccountIndexScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  this.username.keyup(this.usernameKeyUpHandler.bind(this));
  this.completeForm.submit(this.completeFormHandler.bind(this));
  this.isArtist.change(this.isArtistHandler.bind(this));
};

APP.AccountIndexScreen.prototype.isArtistHandler = function(event) {
  var value = parseInt($(event.target).val(), 10);
  this.artistData[value === 0 ? 'hide' : 'show']();
};

APP.AccountIndexScreen.prototype.usernameKeyUpHandler = function(event) {
  if (!Validations.notBlank(this.username.val())) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.timeoutHandler.bind(this), 100);
  }
};

APP.AccountIndexScreen.prototype.timeoutHandler = function() {
  var payload = {
    property: 'username',
    value: this.username.val()
  };
  this.requestHandler('/auth/check', payload, this.checkUsernameComplete);
};

APP.AccountIndexScreen.prototype.checkUsernameComplete = function(response) {
  this.isUserAvailable = response.data.available;
};

APP.AccountIndexScreen.prototype.completeFormHandler = function(event) {
  event.preventDefault();

  var errors = [],
    scope = this;
  if (Validations.notBlank(this.firstname.val())) errors.push('Ingrese sus nombre');
  if (Validations.notBlank(this.lastname.val())) errors.push('Ingrese sus apellidos');
  if (Validations.notBlank(this.username.val())) errors.push('Ingrese su nombre de usuario');
  if (!Validations.username(this.username.val())) errors.push('Nombre de usuario solo acepta numeros y letras');
  if (Validations.notBlank(this.gender.val())) errors.push('Ingrese su genero');
  if (Validations.notBlank(this.birthday.val())) errors.push('Ingrese su cumpleaños');
  if (Validations.notBlank(this.country.val())) errors.push('Ingrese su pais');
  if (Validations.notBlank(this.city.val())) errors.push('Ingrese su ciudad');
  // if(Validations.notBlank(this.biography.val())) errors.push('Ingrese su biografia');

  if (this.typeName.val() === '2') {
    if (Validations.notBlank(this.pseudonimo.val())) errors.push('Ingrese su pseudonimo');
  }

  var interests = [];
  $('input[name=interests]:checked').each(function() {
    interests.push(parseInt($(this).val(), 10));
  });

  if (interests.length < 2) errors.push('Seleccione al menos 2 intereses');
  if (!this.isUserAvailable) errors.push('Usuario no disponible');

  if (errors.length > 0) return this.showFlash('error', errors);

  this.saveLoading.show();
  this.save.hide();

  var data = this.completeForm.serializeArray();
  $.each(data, function(index, value) {
    if (value.name === 'photo') {
      var filter = 'w_150,h_150,c_thumb,d_am_avatar.jpg';
      value.value = Utils.addImageFilter(scope.uploaderImage.photo, filter);
    }
    if (value.name === 'typeName') {
      value.value = parseInt(value.value, 10);
    }
  });
  var url = '/user/' + profile.username + '/account/update';
  this.requestHandler(url, data, this.afterSaveHandler);
}

APP.AccountIndexScreen.prototype.afterSaveHandler = function(response) {
  this.showFlash('succes', 'Se actualizo su perfil');
  this.saveLoading.hide();
  this.save.show();
  var user = response.data.user;
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    window.location.href = '/user/' + user.username;
  }, 1000);
}

APP.AccountIndexScreen.prototype.uploaderImageComplete = function(idImage) {
  this.$view.find('.upload').show();
  $('.cloudinary-fileupload').show();
  var filters = {
    width: 150,
    height: 150,
    crop: 'thumb'
  };
  $.cloudinary.image(idImage, filters).appendTo(this.$view.find('.preview'));
}