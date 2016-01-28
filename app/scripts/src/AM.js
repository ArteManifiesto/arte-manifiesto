/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.AM = function () {
  new APP.RestClientManager();
  new APP.TemplateManager();

  $('.' + path + '-menu').addClass('selected');

  DataApp.currentUser = user || null;
  if (DataApp.currentUser !== null)
    DataApp.currentUser.url = '/user/' + DataApp.currentUser.username;

  var flash, flashMessage;
  errorMessage.length > 0 && (flash = $('.error'), flashMessage = errorMessage[0]);
  successMessage.length > 0 && (flash = $('.succes'), flashMessage = successMessage[0]);

  if (flash) {
    flash.find('.content-text').text(flashMessage);
    flash.addClass('fadeIn');
  }

  this.setupUI();
  this.listeners();
};

APP.AM.constructor = APP.AM;

APP.AM.prototype.setupUI = function () {
  this.signInBtn = $('.am-Signin-button');
  this.closeFlashBtn = $('.close-flash');
  this.flashMessage = $('.flash-message');
  this.closeModalBtn = $('.closed-modal');

  this.generalSearch = $('.general-search');
  this.generalSearchBtn = $('.search-general-btn');
  this.generalSearchOptions = $('.general-search-options');

  this.subscriptionForm = $('.subscription-form');
  this.subscriptionBtn = $('.subscription-btn');

  this.emailSubscription = this.subscriptionForm.find('input[name=email]');

  this.searchBox = $('.search-box');

  this.worksOption = this.generalSearchOptions.find('.works-option');
  this.usersOption = this.generalSearchOptions.find('.users-option');
  this.collectionsOption = this.generalSearchOptions.find('.collections-option');
};

APP.AM.prototype.listeners = function () {
  this.generalSearch.focus(this.searchFocusHandler.bind(this));
  this.generalSearch.blur(this.searchBlurHandler.bind(this));
  this.generalSearch.keyup(this.searchKeyUpHandler.bind(this));
  this.generalSearchBtn.click(this.generalSearchBtnClickHandler.bind(this));

  this.subscriptionForm.submit(this.subscriptionFormHandler.bind(this));
  this.subscriptionBtn.click(this.subscriptionHandler.bind(this));

  this.signInBtn.click(this.signInHandler);
  this.closeFlashBtn.click(this.closeFlashHandler.bind(this));

  $('.am-header-mobile .bars').click(function () {
    $('.body').removeClass('open-right');
    $('.body').toggleClass('open-left');
  });

  $('.am-header-mobile .avatar').click(function () {
    $('.body').removeClass('open-left');
    $('.body').toggleClass('open-right');
  });

  $('.body-inner .cover').click(function () {
    $('.body').removeClass('open-right');
    $('.body').removeClass('open-left');
  });

  $(document).keyup(this.escapeHandler.bind(this));

  this.closeModalBtn.click(this.closeModal.bind(this));

  this.searchBox.submit(this.searchBoxHandler.bind(this));
};

APP.AM.prototype.searchBoxHandler = function (event) {
  event.preventDefault();
  window.location.href = DataApp.discoverWorks + '?term=' + $('.search-box-value').val();
};

APP.AM.prototype.escapeHandler = function (event) {
  if (event.keyCode == 27)
    this.closeModal();
};

APP.AM.prototype.closeModal = function () {
  $('#lean_overlay').trigger("click");
};

APP.AM.prototype.signInHandler = function (event) {
  event.preventDefault();
  Utils.checkAuthentication();
};

APP.AM.prototype.closeFlashHandler = function (event) {
  event.preventDefault();
  this.flashMessage.css('visibility', 'hidden');
};

APP.AM.prototype.subscriptionHandler = function (event) {
  event.preventDefault();
  this.subscriptionForm.submit();
};

APP.AM.prototype.subscriptionFormHandler = function (event) {
  event.preventDefault();

  var errors = [], emailValue = this.emailSubscription.val();
  if (Validations.notBlank(emailValue)) errors.push('Ingrese un correo');
  if (!Validations.email(emailValue)) errors.push('Formato de correo no valido');
  if (errors.length > 0) return APP.BaseScreen.prototype.showFlash.call(this, 'error', errors);

  APP.BaseScreen.prototype.requestHandler.call(this, '/subscribe',
    {email: emailValue}, this.subscriptionComplete, null, true);
};

APP.AM.prototype.subscriptionComplete = function (response) {
  if (response.data.created)
    APP.BaseScreen.prototype.showFlash.call(this, 'succes', 'Suscripcion exitosa');
  else
    APP.BaseScreen.prototype.showFlash.call(this, 'error', ['Ya estas Suscrito']);
};

APP.AM.prototype.searchFocusHandler = function (event) {
  this.generalSearchOptions.show();
};

APP.AM.prototype.searchBlurHandler = function (event) {
  var scope = this;
  var timeout = setTimeout(function () {
    clearTimeout(timeout);
    scope.generalSearchOptions.hide();
  }, 200);
};

APP.AM.prototype.generalSearchBtnClickHandler = function (event) {
  var baseUrl = this.getBaseUrl();
  window.location.href = '/works/category' + baseUrl;
};

APP.AM.prototype.searchKeyUpHandler = function (event) {
  var currentValue = this.generalSearch.val();
  this.generalSearchOptions.show();

  this.worksOption.text(currentValue);
  this.usersOption.text(currentValue);
  this.collectionsOption.text(currentValue);

  var baseUrl = this.getBaseUrl();

  this.worksOption.parent().attr('href', '/works/category' + baseUrl);
  this.usersOption.parent().attr('href', '/users/specialty' + baseUrl);
  this.collectionsOption.parent().attr('href', '/collections/category' + baseUrl);
};

APP.AM.prototype.getBaseUrl = function () {
  var baseUrl = '/all/page-1';
  var value = this.generalSearch.val();
  if (value.length > 0)
    baseUrl += '?term=' + encodeURIComponent(value);
  return baseUrl;
};
