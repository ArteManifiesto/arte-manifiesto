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

	$('.category-text').text(this.oldCategory);
	$('.order-text').text(this.oldOrder);

	if(this.term !== undefined) {
		$('.search-text').show();
		$('.search-text').text(this.term);
	}

	if(this.isFeatured) {
		$('input[type=checkbox]').prop('checked', true);
		$('.featured-text').show();
		$('.featured-text').text('AM');
	}

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
	this.filters.categories.unshift({name:'Todo', nameSlugify:'all'});
	itemRenderer(this.filters.categories, 'category');
	itemRenderer(this.filters.order, 'order');
};

APP.Filters.prototype.listeners = function () {
	$("[data-meta='category']").on('click', this.filterItemHandler.bind(this, 'category'));
	$("[data-meta='order']").on('click', this.filterItemHandler.bind(this, 'order'));
	$(".am-Switch-button").on('click', this.featuredHandler.bind(this));

	$(window).on("popstate", function(e) {
			 if (e.originalEvent.state !== null) {
			 location.reload()
			 }
	 });

	var scope = this;
	this.term = this.term === undefined ? '' : this.term;
	$('.am-Search-input input').val(decodeURIComponent(this.term));
	$('.search-btn').click(function(event){
		event.preventDefault();
		$('.am-Search-input input').trigger({type: 'keypress', which: 13, keyCode: 13});
	});
	$('.am-Search-input input').keypress(function(e) {
		if(e.which == 13) {
			var value = encodeURIComponent($(this).val());
			if(value.length > 0) {
				if(scope.term) {
					DataApp.currentUrl = DataApp.currentUrl.replace('term=' + scope.term, 'term=' + value);
				}else {
					DataApp.currentUrl = DataApp.currentUrl + '&term='+ value;
				}
				scope.term = value;
			}else {
				if(DataApp.currentUrl.indexOf('&term='+ scope.term) > -1){
					DataApp.currentUrl = DataApp.currentUrl.replace('&term='+ scope.term, '');
				}
				if(DataApp.currentUrl.indexOf('term='+ scope.term) > -1){
					DataApp.currentUrl = DataApp.currentUrl.replace('term='+ scope.term, '');
				}
				scope.term = undefined;
			}
			Broadcaster.dispatchEvent('FILTER_CHANGED');
    }
	});
};

APP.Filters.prototype.featuredHandler = function() {
	if(this.isFeatured) {
		DataApp.currentUrl = DataApp.currentUrl.replace('&featured=1','');
	}else {
		DataApp.currentUrl = DataApp.currentUrl + '&featured=1';
	}
	this.isFeatured = !this.isFeatured;
	console.log(this.isFeatured);
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
