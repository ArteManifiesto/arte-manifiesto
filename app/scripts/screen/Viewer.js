/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, container, navigation, data , options) {
  this.container = container;
  this.options = options;
  if (id === 'carrouselItem' || id === 'action' || id === 'notificationItem' || id === 'post') {
  }else {
    this.setupMasonry();
  }

  this.id = id;
  this.navigation = navigation;
  this.initialize = true;
  this.fromExternal = false;
  if(this.navigation) {
    this.navigationManager = new APP.NavigationManager(navigation);
    if(data) {
      this.navigationManager.navigator.currentPage = data.pagination.page;
      this.navigationManager.navigator.totalPages = data.pagination.pages;
    }else {
      this.navigationManager.navigator.currentPage = 1;
      this.navigationManager.navigator.totalPages = 1;
    }
    this.navigationManager.navigator.start();
    this.listeners();
    if(data) {
      this.addItems(data.items);
    }
    else{
      this.fromExternal = true;
      this.navigationManager.navigator.gotoPage(1, true);
    }
  } else {
    if(data)
      this.addItems(data);
    else{
      this.fromExternal = true;
      this.navigationManager.navigator.gotoPage(1, true);
    }
  }
};

APP.Viewer.constructor = APP.Viewer;

APP.Viewer.prototype.setupMasonry = function() {
  var scope = this;
  scope.container.masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  $('.discover-content').on('resetLayout', function () {
    console.log('expand');
    scope.container.masonry();
  })
};

APP.Viewer.prototype.listeners = function() {
  this.pageStart = this.pageLoadStartHandler.bind(this);
  this.navigationManager.navigator.addEventListener(Events.LOAD_START, this.pageStart);

  this.pageEnd = this.pageLoadEndHandler.bind(this);
  this.navigationManager.navigator.addEventListener(Events.LOAD_END, this.pageEnd);
};

APP.Viewer.prototype.pageLoadStartHandler = function() {
  this.container.parent().find('.bare-message').hide();
  this.container.parent().find('.loading').show();
};

APP.Viewer.prototype.pageLoadEndHandler = function(event) {
  if(this.fromExternal) {
    this.initialize = true;
  }else {
    this.initialize = false;
  }
  this.addItems(event.data.items);
};

APP.Viewer.prototype.addItems = function(items) {
  this.container.parent().find('.loading').show();
  if(this.navigation === APP.NavigationManager.PAGINATION && !this.initialize) {
    this.clean();
  }
  if(items.length < 1) {
    if(this.container.parent().find('.bare-message').hasClass('hide')) {
      this.container.parent().find('.bare-message').removeClass('hide');
    }
    var display = this.container.parent().find('.bare-message').show().css('display');
    this.container.parent().find('.bare-message').show().css('display', display);
    this.container.parent().height('auto');
    this.container.parent().find('.loading').hide();
  }
  var scopetemp = this;
  var i = 0, item , counter = 0, lel = [];
  for(i; i< items.length; i++) {
    if (this.id === 'action') {
      if(items[i].verb === 'create-work' || items[i].verb === 'like-work') {
        item = new APP.FeedWorkCreated(items[i], this.options);
      }
      if(items[i].verb === 'follow-user') {
        item = new APP.FeedUserFollow(items[i], this.options);
      }
    }else if (this.id === 'notificationItem') {
      if(items[i].verb === 'review-work'){
        item = new APP.NotificationReview(items[i], this.options);
      }
      if(items[i].verb === 'follow-user') {
          item = new APP.NotificationFollow(items[i], this.options);
      }
      if(items[i].verb === 'like-work') {
        item = new APP.NotificationLike(items[i], this.options);
      }
      if(items[i].verb === 'request-work') {
        item = new APP.NotificationRequest(items[i], this.options);
      }
    }
     else {
      item = new APP[Utils.capitalize(this.id)](items[i], this.options);
    }
    if(item.view.children().hasClass( "work-card" )) {
      var $items = item.view;
      $items.attr('id', item.data.id);
      $items.hide();
      this.container.append($items);
      lel.push(item.data.id);
      var scope = this.container;
      $items.imagesLoaded().progress(function(imgLoad, image) {
        ++counter;
        // var $item =
        $(image.img).parents('.grid-item');
        if(counter === items.length) {
          var timeout = setTimeout(function() {
            clearTimeout(timeout);
            for(i = 0; i< lel.length; i++) {
              var it = $('#' + lel[i]);
              it.show();
              scope.masonry('appended',it);
              scope.masonry();
              if(scopetemp.navigationManager)
                scopetemp.navigationManager.navigator.restart();
              scope.parent().find('.loading').hide();
            }
          }, 1000);
        }
      });
    }
    else {
        if(this.id === 'carrouselItem' || this.id === 'action' || this.id === 'notificationItem'  || this.id === 'post') {
        this.container.append(item.view); 
      }else{
        this.container.append(item.view).masonry('appended', item.view);
      }
      if(scopetemp.navigationManager){
        scopetemp.navigationManager.navigator.restart();
      }
      this.container.parent().find('.loading').hide();
    }
  }
};

APP.Viewer.prototype.reset = function() {
  this.clean();
  this.navigationManager.navigator.reset();
};

APP.Viewer.prototype.clean = function() {
  this.container.masonry('remove', this.container.find('.grid-item')).masonry();
  this.initialize = false;
};

APP.Viewer.prototype.suspend = function() {
  this.navigationManager.navigator.suspend();
  this.navigationManager.navigator.removeEventListener(Events.LOAD_START, this.pageStart);
  this.navigationManager.navigator.removeEventListener(Events.LOAD_END, this.pageEnd);
};

APP.Viewer.prototype.restart = function() {
  this.navigationManager.navigator.addEventListener(Events.LOAD_START, this.pageStart);
  this.navigationManager.navigator.addEventListener(Events.LOAD_END, this.pageEnd);
  this.navigationManager.navigator.restart();
  this.container.masonry();
};
