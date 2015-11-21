/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Work = function (data) {
    APP.BaseElement.call(this, data, 'work');
};

APP.Work.prototype = Object.create(APP.BaseElement.prototype);

APP.Work.constructor = APP.Work;


APP.Work.prototype.listeners = function () {
  APP.BaseElement.prototype.listeners.call(this);
  this.view.find('.delete').click(this.deleteHandler.bind(this));
  this.view.find('.edit').click(this.editHandler.bind(this));
};

APP.Work.prototype.deleteHandler = function() {
  var url = '/user/'+ this.data.User.username +'/work/delete';
  var scope = this;
  $.post(url,{idWork: this.data.id}, function (response) {
    if(response.status === 200)
      $(scope.view.parent()).masonry('remove', scope.view).masonry();
  });
};

APP.Work.prototype.editHandler = function() {
  location.href = '/user/'+ this.data.User.username +'/work/'+ this.data.nameSlugify +'/published';
};
