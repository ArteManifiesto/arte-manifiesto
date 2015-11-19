/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AuthScreen = function (meta) {
  this.meta = meta;
  this.listeners();
};

APP.AuthScreen.constructor = APP.AuthScreen;

APP.AuthScreen.prototype.listeners = function() {
  $('.fb').click(this.fbHandler.bind(this));
  $('.auth-form').submit(this.formHandler.bind(this));
};

APP.AuthScreen.prototype.fbHandler = function() {
  $('.fb').hide();
  $('.fb-loading').show();
};

APP.AuthScreen.prototype.formHandler = function() {
  event.preventDefault();
  $('.submit').hide();
  $('.submit-loading').show();
  var url =  '/auth/' + this.meta;
  $.post(url , $('.auth-form').serialize(), this.authRequestHandler);
};

APP.AuthScreen.prototype.authRequestHandler = function(response) {
    if(response.status === 400){
      $('.errors').empty();
      $.each(response.data, function( key, value ) {
        $('.' + key).removeClass('error');
      });
      $.each(response.data, function( key, value ) {
        $('.' + key).addClass('error');
        $('.errors').append($('<li>'+ value +'</li>'));
      });
    }

    if(response.status === 200) {
      return location.href = response.data.returnTo
    }

    $('.submit').show();
    $('.submit-loading').hide();
};
