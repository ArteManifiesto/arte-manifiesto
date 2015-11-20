/**
*Author : www.juliocanares.com/cv
*Email : juliocanares@gmail.com
*/
var APP = APP || {};

APP.Viewer = function (id, container, navigation, data , options) {
  this.container = container;

  if(id !== 'carrouselItem'){
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
  // this.navigationManager.navigator.addEventListener(Events.LOAD_START, this.pageEnd);
  Broadcaster.addEventListener('PAGE_LOAD_START', this.pageStart);

  this.pageEnd = this.pageLoadEndHandler.bind(this);
  // this.navigationManager.navigator.addEventListener(Events.LOAD_END, this.pageEnd);
  Broadcaster.addEventListener('PAGE_LOAD_END', this.pageEnd);
};

APP.Viewer.prototype.pageLoadStartHandler = function() {
  $('.loading').show();
  this.container.parent().find('.empty-message').hide();
  //$('.empty-message').hide();
  $('.loading').hide();
};

APP.Viewer.prototype.pageLoadEndHandler = function(event) {
  $('.loading').hide();
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
  //console.log(items.length , this.navigationManager.navigator.currentPage);
  //console.log(this.container);
  if (this.navigationManager) {
    if(items.length < 1 && this.navigationManager.navigator.currentPage === 1) {
      // this.options.onEmpty();
      this.container.parent().find('.empty-message').show();
      // $('.empty-message').show();
    }
  }

  var i = 0, item;
  for(i; i< items.length; i++) {
      item = new APP[Utils.capitalize(this.id)](items[i]);

    // console.log('item.view.children().hasClass( "work-card" ): ', )

    // if(this.navigation) {
    //   if(this.initialize) {
    //     this.container.append(item.view);
    //   }
    //   else {
    //     this.container.append(item.view).masonry('appended', item.view);
    //   }
    // }else {
    //     this.container.append(item.view);
    // }

    if(item.view.children().hasClass( "work-card" )) {
      console.log('work-card')

      var $items = item.view;
      $items.hide();
      this.container.append( $items );
      var scope = this.container
      $items.imagesLoaded().progress( function( imgLoad, image ) {
        var $item = $( image.img ).parents('.grid-item');
        $item.show();
        scope.masonry( 'appended', $item );
      });
    }
    else {
      this.container.append(item.view).masonry('appended', item.view);
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
  // this.navigationManager.navigator.removeEventListener(Events.LOAD_START, this.pageEnd);
  // this.navigationManager.navigator.removeEventListener(Events.LOAD_END, this.pageEnd);
  Broadcaster.removeEventListener('PAGE_LOAD_START', this.pageStart);
  Broadcaster.removeEventListener('PAGE_LOAD_END', this.pageEnd);
}

APP.Viewer.prototype.restart = function() {
  // this.navigationManager.navigator.removeEventListener(Events.LOAD_START, this.pageEnd);
  // this.navigationManager.navigator.removeEventListener(Events.LOAD_END, this.pageEnd);
  Broadcaster.addEventListener('PAGE_LOAD_START', this.pageStart);
  Broadcaster.addEventListener('PAGE_LOAD_END', this.pageEnd);
  this.container.masonry();
}
