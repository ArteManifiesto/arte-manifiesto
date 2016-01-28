/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.AdminEditUserScreen = function () {
  APP.BaseScreen.call(this, 'adminEditUser');
};

APP.AdminEditUserScreen.constructor = APP.AdminEditUserScreen;
APP.AdminEditUserScreen.prototype = Object.create(APP.BaseScreen.prototype);

APP.AdminEditUserScreen.prototype.setupUI = function () {
  this.amBtn = $('.am-btn');
  this.deleteBtn = $('.delete-btn');
  this.updateBtn = $('.update-btn');
};

APP.AdminEditUserScreen.prototype.listeners = function () {
  APP.BaseScreen.prototype.listeners.call(this);

  this.amBtn.click(this.amHandler.bind(this));
  this.deleteBtn.click(this.deleteHandler.bind(this));
  this.updateBtn.click(this.updateHandler.bind(this));
};

APP.AdminEditUserScreen.prototype.amHandler = function (event) {
  event.preventDefault();
  var url = '/user/' + userToEdit.username + '/' + (userToEdit.featured ? 'unfeatured' : 'featured');
  this.requestHandler(url, {idUser: userToEdit.id}, this.featuredComplete);
};

APP.AdminEditUserScreen.prototype.featuredComplete = function (response) {
  userToEdit = response.data.user;
  if (userToEdit.featured)
    this.amBtn.addClass('btn-primary').val('Recomendado');
  else
    this.amBtn.removeClass('btn-primary').val('Recomendar');

    this.showFlash('succes', 'Se actualizo el usuario');
};

APP.AdminEditUserScreen.prototype.deleteHandler = function (event) {
  event.preventDefault();
  var result = confirm("Quiero eliminar este usuario?");
  if (result) {
    var url = '/user/' + userToEdit.username + '/delete';
    this.requestHandler(url, {idUser: userToEdit.id}, this.deleteComplete);
  }
};

APP.AdminEditUserScreen.prototype.deleteComplete = function () {
  this.showFlash('succes', 'Se elimino el usuario');
  setTimeout(function () {
    window.location.href = '/report';
  }, 1000);
};

APP.AdminEditUserScreen.prototype.updateHandler = function (event) {
  event.preventDefault();
  var url = '/user/' + userToEdit.username + '/account/update';
  this.requestHandler(url, $('form').serialize(), this.updateComplete);
};

APP.AdminEditUserScreen.prototype.updateComplete = function (response) {
  this.showFlash('succes', 'Se actualizo el usuario');
};
