/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.AM = function() {
  this.setupData();
  this.setupUI();
  this.listeners();
};

APP.AM.constructor = APP.AM;

APP.AM.prototype.setupData = function() {
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
};

APP.AM.prototype.setupUI = function() {
  this.signInBtn = $('.am-Signin-button');
  this.closeFlashBtn = $('.close-flash');
  this.flashMessage = $('.flash-message');
  this.closeModalBtn = $('.closed-modal');

  this.generalSearch = $('.general-search');
  this.generalSearchBtn = $('.search-general-btn');
  this.generalSearchOptions = $('.general-search-options');

  this.subscriptionForm = $('.subscription-form');
  this.subscriptionBtn = $('.subscription-btn');

  this.body = $('.body');
  this.searchBox = $('.search-box');
  this.headerBars = $('.am-header-mobile .bars');
  this.headerAvatar = $('.am-header-mobile .avatar');
  this.headerCover = $('.body-inner .cover');

  this.worksOption = this.generalSearchOptions.find('.works-option');
  this.productsOption = this.generalSearchOptions.find('.products-option');
  this.usersOption = this.generalSearchOptions.find('.users-option');
  this.collectionsOption = this.generalSearchOptions.find('.collections-option');
  this.emailSubscription = this.subscriptionForm.find('input[name=email]');
};

APP.AM.prototype.listeners = function() {
  this.generalSearch.focus(this.searchFocusHandler.bind(this));
  this.generalSearch.blur(this.searchBlurHandler.bind(this));
  this.generalSearch.keyup(this.searchKeyUpHandler.bind(this));
  this.generalSearchBtn.click(this.generalSearchBtnClickHandler.bind(this));

  this.subscriptionForm.submit(this.subscriptionFormHandler.bind(this));
  this.subscriptionBtn.click(this.subscriptionHandler.bind(this));

  this.signInBtn.click(this.signInHandler);
  this.closeFlashBtn.click(this.closeFlashHandler.bind(this));

  this.headerBars.click(this.headerBarsHandler.bind(this));

  this.headerAvatar.click(this.headerAvatarHandler.bind(this));

  this.headerCover.click(this.headerCoverHandler.bind(this));
  this.closeModalBtn.click(this.closeModal.bind(this));
  this.searchBox.submit(this.searchBoxHandler.bind(this));
  $(document).keyup(this.escapeHandler.bind(this));

  $('.ad-target').click(this.adClickHandler.bind(this));
};

APP.AM.prototype.headerCoverHandler = function(event) {
  this.body.removeClass('open-right');
  this.body.removeClass('open-left');
};
APP.AM.prototype.headerAvatarHandler = function(event) {
  event.preventDefault();
  this.body.removeClass('open-left');
  this.body.toggleClass('open-right');
};
APP.AM.prototype.headerBarsHandler = function(event) {
  event.preventDefault();
  this.body.removeClass('open-right');
  this.body.toggleClass('open-left');
};
APP.AM.prototype.searchBoxHandler = function(event) {
  event.preventDefault();
  window.location.href = DataApp.discoverUsers + '?term=' + $('.search-box-value').val();
};

APP.AM.prototype.escapeHandler = function(event) {
  if (event.keyCode == 27)
    this.closeModal();
};

APP.AM.prototype.closeModal = function() {
  $('#lean_overlay').trigger("click");
};

APP.AM.prototype.signInHandler = function(event) {
  event.preventDefault();
  Utils.checkAuthentication();
};

APP.AM.prototype.closeFlashHandler = function(event) {
  event.preventDefault();
  this.flashMessage.css('visibility', 'hidden');
};

APP.AM.prototype.subscriptionHandler = function(event) {
  event.preventDefault();
  this.subscriptionForm.submit();
};

APP.AM.prototype.subscriptionFormHandler = function(event) {
  event.preventDefault();

  var errors = [],
    emailValue = this.emailSubscription.val();
  if (Validations.notBlank(emailValue)) errors.push('Ingrese un correo');
  if (!Validations.email(emailValue)) errors.push('Formato de correo no valido');
  if (errors.length > 0) return APP.BaseScreen.prototype.showFlash.call(this, 'error', errors);

  $.post('/subscribe', {
    email: emailValue
  }).then(this.subscriptionComplete.bind(this));
};

APP.AM.prototype.subscriptionComplete = function(response) {
  if (response.data.created)
    APP.BaseScreen.prototype.showFlash.call(this, 'succes', 'Suscripcion exitosa');
  else
    APP.BaseScreen.prototype.showFlash.call(this, 'error', ['Ya estas Suscrito']);
};

APP.AM.prototype.searchFocusHandler = function(event) {
  this.generalSearchOptions.show();
};

APP.AM.prototype.searchBlurHandler = function(event) {
  var scope = this;
  var timeout = setTimeout(function() {
    clearTimeout(timeout);
    scope.generalSearchOptions.hide();
  }, 200);
};

APP.AM.prototype.generalSearchBtnClickHandler = function(event) {
  var baseUrl = this.getBaseUrl();
  window.location.href = '/works/category' + baseUrl;
};

APP.AM.prototype.searchKeyUpHandler = function(event) {
  var currentValue = this.generalSearch.val();
  this.generalSearchOptions.show();

  this.worksOption.text(currentValue);
  this.usersOption.text(currentValue);
  this.collectionsOption.text(currentValue);
  this.productsOption.text(currentValue);

  var baseUrl = this.getBaseUrl();

  this.worksOption.parent().attr('href', '/works/category' + baseUrl);
  this.productsOption.parent().attr('href', '/products/category' + baseUrl);
  this.usersOption.parent().attr('href', '/users/specialty' + baseUrl);
  this.collectionsOption.parent().attr('href', '/collections/category' + baseUrl);
};

APP.AM.prototype.adClickHandler = function(e) {
  e.preventDefault();
  var me = $(e.currentTarget);
  var id = me.data('id');
  var link = me.attr('href');

  $.post('/ad/click', {adId: id});

  var win = window.open(link, '_blank');
  win.focus();
};

APP.AM.prototype.getBaseUrl = function() {
  var baseUrl = '/all/page-1';
  var value = this.generalSearch.val();
  if (value.length > 0)
    baseUrl += '?term=' + encodeURIComponent(value);
  return baseUrl;
};