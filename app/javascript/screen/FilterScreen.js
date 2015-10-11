/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.FilterScreen = function (filters) {
	this.filters = filters;

	this.oldCategory = this.filters.currentCategory;
	this.oldOrder = this.filters.currentOrder;

	this.currentCategory = this.currentOrder = null;

	this.buildFilters();
	this.listeners();
};

APP.FilterScreen.constructor = APP.FilterScreen;

APP.FilterScreen.prototype.buildFilters = function() {
	var itemRenderer = function(data, meta) {
		var item;
		$.each(data, function(index, value){
			value.meta = meta;
			item = APP.TemplateManager.instance.templates['filter-item'](value);
			$('.filter-' + meta).append(item);
		});
	};
	itemRenderer(this.filters.categories, 'category');
	itemRenderer(this.filters.orders, 'order');
};

APP.FilterScreen.prototype.listeners = function () {
	$("[data-meta='category']").on('click', this.filterItemHandler.bind(this, 'category'));
	$("[data-meta='order']").on('click', this.filterItemHandler.bind(this, 'order'));
};

APP.FilterScreen.prototype.filterItemHandler = function(meta, event) {
	var filterCapitalized = Utils.capitalize(meta);
	var oldFilter = 'old' + filterCapitalized;
	var currentFilter = 'current' + filterCapitalized;

	this[currentFilter] = $(event.target).html();
	DataApp.currentUrl = DataApp.currentUrl.replace(this[oldFilter], this[currentFilter]);
	this[oldFilter] = this[currentFilter];

	console.log(DataApp.currentUrl);
};
