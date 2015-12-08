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

  $('.' + path + '-menu').addClass('selected');

  DataApp.currentUser = user || null;
	if(DataApp.currentUser !== null)
		DataApp.currentUser.url = '/user/' + DataApp.currentUser.username;

  var flash, flashMessage;
  errorMessage.length > 0 && (flash = $('.error'), flashMessage = errorMessage[0]);
  successMessage.length > 0 && (flash = $('.succes'), flashMessage = successMessage[0]);

  if(flash) {
    flash.find('.content-text').text(flashMessage);
    flash.addClass('fadeIn');
  }

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
  $('.closed-modal').click(function () {
    $('#lean_overlay').trigger( "click" );
  });

  $('.search-box').submit(function(event) {
    event.preventDefault();
    window.location.href = DataApp.discoverWorks + '?term=' + $('.search-box-value').val();
  });
};

APP.AM.constructor = APP.AM;
