/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.ProfileScreen = function() {
  this.currentItem, this.oldItem;
  this.currentSection, this.oldSection;
  this.currentViewer, this.oldViewer;

  this.paths = [];
  this.viewers = [];
  this.uploaderCover = new APP.UploaderImage($('.uploader-cover'), this.uploadComplete);

  APP.BaseScreen.call(this, 'profile');
};

APP.ProfileScreen.constructor = APP.ProfileScreen;
APP.ProfileScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.ProfileScreen.prototype.listeners = function() {
  APP.BaseScreen.prototype.listeners.call(this);
  $('.am-Profile-menu-item').click(this.menuItemClickHandler.bind(this));
  $('.am-Follow-button').click(this.followClickHandler.bind(this));
  $('.cancel-icon').click(this.cancelClickHandler.bind(this));
  $('.save-icon').click(this.saveClickHandler.bind(this));

  $('.am-Profile-menu-item[data-name=' + currentPath + ']').click();


  this.featuredBtn = $('.featured');
  this.featuredBtn.click(this.featuredHandler.bind(this));
};

APP.ProfileScreen.prototype.featuredHandler = function() {
  if (!DataApp.currentUser || !DataApp.currentUser.isAdmin) return;

  var url, tempId = 'user';

  if (profile.featured) {
    url = '/user/' + profile.username + '/unfeatured';
  } else {
    url = '/user/' + profile.username + '/featured';
  }

  var scope = this,
    payload = {};
  payload['id' + Utils.capitalize(tempId)] = profile.id;
  $.post(url, payload, function(response) {
    console.log(response);
    if (response.status === 200) {
      if (response.data[tempId].featured) {
        scope.featuredBtn.removeClass('disabled');
      } else {
        scope.featuredBtn.addClass('disabled');
      }
      profile.featured = response.data[tempId].featured;
    }
  });
};

APP.ProfileScreen.prototype.saveClickHandler = function() {
  var url = DataApp.currentUser.url + '/account/update_cover';
  this.requestHandler(url, {
    cover: this.uploaderCover.photo
  }, this.updateCoverComplete);
  $('.save-icon, .cancel-icon').hide();
  $('.cloudinary-fileupload, .upload').show();
};

APP.ProfileScreen.prototype.followClickHandler = function() {
  Utils.checkAuthentication();
  var url = DataApp.currentUser.url + (profile.following ? '/unfollow/' : '/follow/');
  this.requestHandler(url, {
    idUser: profile.id
  }, this.followComplete);
};

APP.ProfileScreen.prototype.menuItemClickHandler = function(event) {
  this.currentItem = $(event.currentTarget);
  var path = this.currentItem.data('name');

  var url = '/user/' + profile.username + '/' + (path === 'portfolio' ? '' : path)
  Utils.changeUrl(DataApp.baseTitle + Utils.capitalize(path), url);

  this.currentSection = $('.' + path + '-wrapper');

  this.oldItem && this.oldItem.removeClass('selected');
  this.oldViewer && this.oldViewer.suspend();
  this.oldSection && this.oldSection.hide();

  this.currentItem.addClass('selected');
  this.currentSection.show();

  if (this.paths.indexOf(path) === -1) {
    var template = this.getTemplate(path),
      section = $('.' + path + '-container');
    if(path === 'product'){
      this.currentViewer = new APP.DiscoverScreen(template, section, 'infinite', discover);
    }
    else{
      this.currentViewer = new APP.Viewer(template, section, 'infinite');
    }
    this.currentViewer.navigationManager.navigator.needChangeUrl = true;
    this.viewers.push(this.currentViewer);
    this.paths.push(path);
  } else {
    this.currentViewer = this.viewers[this.paths.indexOf(path)]
    this.currentViewer.restart();
  }

  this.oldItem = this.currentItem;
  this.oldViewer = this.currentViewer;
  this.oldSection = this.currentSection;
}

APP.ProfileScreen.prototype.updateCoverComplete = function(response) {
  DataApp.currentUser.cover = this.uploaderCover.photo;
  $('.save-icon, .cancel-icon').hide();
  $('.cloudinary-fileupload, .upload').show();
};

APP.ProfileScreen.prototype.cancelClickHandler = function() {
  $('.preview > img').attr('src', DataApp.currentUser.cover);
  $('.save-icon, .cancel-icon').hide();
  $('.cloudinary-fileupload, .upload').show();
};

APP.ProfileScreen.prototype.followComplete = function(response) {
  if (!profile.following)
    $('.am-Follow-button').text('Siguiendo').addClass('following');
  else
    $('.am-Follow-button').text('+Seguir').removeClass('following');

  profile.following = !profile.following;
};
APP.ProfileScreen.prototype.uploadComplete = function(idImage) {
  var filters = {
    format: 'jpg',
    width: 1600,
    crop: "limit",
    quality: 80
  };
  var img = $.cloudinary.image(idImage, filters);
  img.addClass('am-Profile-banner-img').appendTo(this.$view.find('.preview'));
  this.photo = img.attr('src');
  $('.save-icon , .cancel-icon').show();
};