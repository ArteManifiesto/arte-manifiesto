/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};
APP.AM = function () {
  new APP.RestClientManager();
  new APP.TemplateManager();

  // $(window).on("popstate", function(e) {
	// 		 if (e.originalEvent.state !== null) {
	// 		 location.reload()
	// 		 }
	//  });
  //

  // $('.' + path + '-menu').addClass('selected');

  // DataApp.currentUser = user || null;
	// if(DataApp.currentUser !== null)
	// 	DataApp.currentUser.url = '/user/' + DataApp.currentUser.username;

  // var flash, flashMessage;
  // errorMessage.length > 0 && (flash = $('.error'), flashMessage = errorMessage[0]);
  // successMessage.length > 0 && (flash = $('.succes'), flashMessage = successMessage[0]);
  //
  // if(flash) {
  //   flash.find('.content-text').text(flashMessage);
  //   flash.addClass('fadeIn');
  // }

  $('.am-Signin-button').click(function(event) {
    event.preventDefault();
    Utils.checkAuthentication();
  });

  $('.close-flash').click(function(event) {
    $('.flash-message').css('visibility', 'hidden');
  })

  $('.am-header-mobile .bars').click(function () {
    $('.body').removeClass('open-right')
    $('.body').toggleClass('open-left')
  })

  $('.am-header-mobile .avatar').click(function () {
    $('.body').removeClass('open-left')
    $('.body').toggleClass('open-right')
  })

  $('.body-inner .cover').click(function () {
    $('.body').removeClass('open-right')
    $('.body').removeClass('open-left')
  })

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      $('#lean_overlay').trigger( "click" );
    }
  });

  // $(document).click(function(e) {
  //   $('.general-search-options').hide();
  // });

  $('.closed-modal').click(function () {
    $('#lean_overlay').trigger( "click" );
  });

  $('.search-box').submit(function(event) {
    event.preventDefault();
    window.location.href = DataApp.discoverWorks + '?term=' + $('.search-box-value').val();
  });

  this.setupUI();
  this.listeners();
};

APP.AM.constructor = APP.AM;

APP.AM.prototype.setupUI = function() {
  this.generalSearch = $('.general-search');
  this.generalSearchBtn = $('.search-general-btn');
  this.generalSearchOptions = $('.general-search-options');

  this.subscriptionForm = $('.subscription-form');
  this.subscriptionBtn = $('.subscription-btn');

  this.worksOption = this.generalSearchOptions.find('.works-option');
  this.usersOption = this.generalSearchOptions.find('.users-option');
  this.collectionsOption = this.generalSearchOptions.find('.collections-option');
};

APP.AM.prototype.listeners = function() {
  this.generalSearch.focus(this.searchFocusHandler.bind(this));
  this.generalSearch.blur(this.searchBlurHandler.bind(this));
  this.generalSearch.keyup(this.searchKeyUpHandler.bind(this));
  this.generalSearchBtn.click(this.generalSearchBtnClickHandler.bind(this));

  this.subscriptionForm.submit(this.subscriptionFormHandler.bind(this));
  this.subscriptionBtn.click(this.subscriptionHandler.bind(this));
};

APP.AM.prototype.subscriptionHandler = function(event) {
  this.subscriptionForm.submit();
};

APP.AM.prototype.subscriptionFormHandler = function(event) {
  event.preventDefault();

  var errors = [];
  if(Validations.notBlank(this.name.val())) errors.push('Ingrese un nombre');

  if(errors.length > 0) return this.showFlash('error', errors);

  // var payload = {email: };

  $.post('/subscribe', payload).then(this.subscriptionComplete.bind(this));
};

APP.AM.prototype.subscriptionComplete = function(response) {
  if(response.data.created) {
    APP.BaseScreen.prototype.showFlash('succes', 'Suscripcion exitosa');
  } else {
    APP.BaseScreen.prototype.showFlash('error', ['Ya estas Suscrito']);
  }
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

  var baseUrl = this.getBaseUrl();

  this.worksOption.parent().attr('href', '/works/category' + baseUrl);
  this.usersOption.parent().attr('href', '/users/specialty' + baseUrl);
  this.collectionsOption.parent().attr('href', '/collections/category' + baseUrl);
};

APP.AM.prototype.getBaseUrl = function() {
  var baseUrl = '/all/page-1';
  var value = this.generalSearch.val();
  if(value.length > 0)
    baseUrl += '?term=' + encodeURIComponent(value);
  return baseUrl;
};
