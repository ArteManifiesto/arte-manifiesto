/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, container, navigation, data , events) {
  this.container = container;

  if (id !== 'carrouselItem') {
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
    if(data)
      this.addItems(data.items);
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
  // this.events = events;
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
    scope.container.masonry()
  })
};

APP.Viewer.prototype.listeners = function() {
  this.pageStart = this.pageLoadStartHandler.bind(this);
  this.navigationManager.navigator.addEventListener(Events.LOAD_START, this.pageStart);

  this.pageEnd = this.pageLoadEndHandler.bind(this);
  this.navigationManager.navigator.addEventListener(Events.LOAD_END, this.pageEnd);
};

APP.Viewer.prototype.pageLoadStartHandler = function() {
  this.container.parent().find('.empty-message').hide();
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
  if(this.navigation === APP.NavigationManager.PAGINATION && !this.initialize) {
    this.clean();
  }
  if(items.length < 1) {
    this.container.parent().height('auto');
    this.container.parent().find('.loading').hide();
    this.container.parent().find('.empty-message').show();
  }
  var scopetemp = this;
  var i = 0, item , counter = 0, lel = [];
  for(i; i< items.length; i++) {
      item = new APP[Utils.capitalize(this.id)](items[i]);
    if(item.view.children().hasClass( "work-card" )) {
      var $items = item.view;
      $items.hide();
      this.container.append($items);
      var scope = this.container
      $items.imagesLoaded().progress(function(imgLoad, image) {
        ++counter;
        var $item = $(image.img).parents('.grid-item');
          lel.push($item);
        if(counter === items.length) {
          for(i = 0; i< lel.length; i++) {
            lel[i].show();
            scope.masonry('appended',lel[i]);
            if(scopetemp.navigationManager)
              scopetemp.navigationManager.navigator.restart();
            scope.parent().find('.loading').hide();
          }
        }
      });
    }
    else {
      if(this.id !== 'carrouselItem') {
        this.container.append(item.view).masonry('appended', item.view);
      }else{
        this.container.append(item.view)
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
}

APP.Viewer.prototype.suspend = function() {
  this.navigationManager.navigator.suspend();
  this.navigationManager.navigator.removeEventListener(Events.LOAD_START, this.pageStart);
  this.navigationManager.navigator.removeEventListener(Events.LOAD_END, this.pageEnd);
}

APP.Viewer.prototype.restart = function() {
  this.navigationManager.navigator.addEventListener(Events.LOAD_START, this.pageStart);
  this.navigationManager.navigator.addEventListener(Events.LOAD_END, this.pageEnd);
  this.navigationManager.navigator.restart();
  this.container.masonry();
}
