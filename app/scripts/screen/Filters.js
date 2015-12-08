/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Filters = function (filters) {
  this.filters = filters;

  this.oldCategory = this.filters.currentCategory;
  this.oldOrder = this.filters.currentOrder;

  this.isFeatured = Utils.getUrlParameter('featured') !== undefined;
  this.term = Utils.getUrlParameter('term');
  this.currentCategory = this.currentOrder = null;

  this.setupUI();
  this.listeners();

  this.isInitialized = false;
};

APP.Filters.constructor = APP.Filters;


APP.Filters.prototype.setupUI = function () {
  this.filters.categories.unshift({name: 'Todo', nameSlugify: 'all'});

  this.itemFilterRenderer(this.filters.categories, 'category');
  this.itemFilterRenderer(this.filters.order, 'order');

  this.featuredBtn = $('.am-Switch-button');
  this.searchInput = $('.am-Search-input input');
  this.searchBtn = $('.search-btn');

  this.categories = $('[data-meta=category]');
  this.orders = $('[data-meta=order]');

  $('[data-value=' + this.oldCategory + ']').parent().addClass('selected');
  $('[data-value=' + this.oldOrder + ']').parent().addClass('selected');

  if (this.isFeatured) $('input[type=checkbox]').prop('checked', true);
};

APP.Filters.prototype.itemFilterRenderer = function (data, meta) {
  var item = APP.TemplateManager.instance.getFromDoc('filter-item');
  $.each(data, function (index, value) {
    value.meta = meta;
    $('.filter-' + meta).append(item(value));
  });
};

APP.Filters.prototype.listeners = function () {
  this.categories.on('click', this.filterItemHandler.bind(this, 'category'));
  this.orders.on('click', this.filterItemHandler.bind(this, 'order'));
  this.featuredBtn.on('click', this.featuredHandler.bind(this));

  this.term = this.term === undefined ? '' : this.term;
  this.searchInput.val(decodeURIComponent(this.term));

  this.searchBtn.click(this.searchHandler.bind(this));

  this.searchInput.keypress(this.searchKeyPressHandler.bind(this));
};

APP.Filters.prototype.searchKeyPressHandler = function (event) {
  if (event.which !== 13) return;
  var value = encodeURIComponent($(event.target).val());
  if (value.length > 0) {
    if (this.term) {
      DataApp.currentUrl = DataApp.currentUrl.replace('term=' + this.term, 'term=' + value);
    } else {
      DataApp.currentUrl = DataApp.currentUrl + '&term=' + value;
    }
    this.term = value;
  } else {
    if (DataApp.currentUrl.indexOf('&term=' + this.term) > -1) {
      DataApp.currentUrl = DataApp.currentUrl.replace('&term=' + this.term, '');
    }
    if (DataApp.currentUrl.indexOf('term=' + this.term) > -1) {
      DataApp.currentUrl = DataApp.currentUrl.replace('term=' + this.term, '');
    }
    this.term = undefined;
  }
  Broadcaster.dispatchEvent(Events.FILTER_CHANGED);
};

APP.Filters.prototype.searchHandler = function (event) {
  event.preventDefault();
  this.searchInput.trigger({type: 'keypress', which: 13, keyCode: 13});
}

APP.Filters.prototype.featuredHandler = function () {
  if (this.isFeatured)
    DataApp.currentUrl = DataApp.currentUrl.replace('&featured=1', '');
  else
    DataApp.currentUrl = DataApp.currentUrl + '&featured=1';
  this.isFeatured = !this.isFeatured;
  Broadcaster.dispatchEvent(Events.FILTER_CHANGED);
};

APP.Filters.prototype.start = function () {
  $('[data-value=' + this.oldCategory + ']').click();
  $('[data-value=' + this.oldOrder + ']').click();

  this.isInitialized = true;
};

APP.Filters.prototype.filterItemHandler = function (meta, event) {
  var filterCapitalized = Utils.capitalize(meta);
  var oldFilter = 'old' + filterCapitalized;
  var currentFilter = 'current' + filterCapitalized;

  this[currentFilter] = $(event.target).attr('data-value');
  $('[data-value=' + this[oldFilter] + ']').parent().removeClass('selected');
  $('[data-value=' + this[currentFilter] + ']').parent().addClass('selected');

  DataApp.currentUrl = DataApp.currentUrl.replace(this[oldFilter], this[currentFilter]);
  this[oldFilter] = this[currentFilter];
  var newValue = $(event.target).attr('data-name');

  Broadcaster.dispatchEvent(Events.FILTER_CHANGED, {meta: meta, newValue: newValue});
};
