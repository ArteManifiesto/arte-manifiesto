/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.Filters = function (filters) {
	this.filters = filters;

	this.oldCategory = this.filters.currentCategory;
	this.oldOrder = this.filters.currentOrder;

	this.isFeatured = Utils.getUrlParameter('featured');
	this.currentCategory = this.currentOrder = null;

	this.buildFilters();
	this.listeners();
};

APP.Filters.constructor = APP.Filters;

APP.Filters.prototype.buildFilters = function() {
	var itemRenderer = function(data, meta) {
		var item = APP.TemplateManager.instance.getFromDoc('filter-item');
		$.each(data, function(index, value){
			value = _.isObject(value) ? value : {name: value}
			value.meta = meta;
			$('.filter-' + meta).append(item(value));
		});
	};
	itemRenderer(this.filters.categories, 'category');
	itemRenderer(this.filters.order, 'order');
};

APP.Filters.prototype.listeners = function () {
	$("[data-meta='category']").on('click', this.filterItemHandler.bind(this, 'category'));
	$("[data-meta='order']").on('click', this.filterItemHandler.bind(this, 'order'));
	$(".am-Switch-button").on('click', this.featuredHandler);
};

APP.Filters.prototype.featuredHandler = function() {
	if(this.isFeatured) {
		DataApp.currentUrl = DataApp.currentUrl.replace('&featured=1','');
	}else {
		DataApp.currentUrl = DataApp.currentUrl + '&featured=1';
	}
	this.isFeatured = !this.isFeatured;
	Broadcaster.dispatchEvent('FILTER_CHANGED');
};

APP.Filters.prototype.filterItemHandler = function(meta, event) {
	var filterCapitalized = Utils.capitalize(meta);
	var oldFilter = 'old' + filterCapitalized;
	var currentFilter = 'current' + filterCapitalized;

	this[currentFilter] = $(event.target).attr('data-value');
	
	DataApp.currentUrl = DataApp.currentUrl.replace(this[oldFilter], this[currentFilter]);
	this[oldFilter] = this[currentFilter];

	Broadcaster.dispatchEvent('FILTER_CHANGED',{meta:meta, newValue: this[currentFilter]});
};
