/**
 *Author : www.juliocanares.com/cv
 *Email : juliocanares@gmail.com
 */
var APP = APP || {};

APP.DiscoverScreen = function (id, container, navigation, data) {
		DataApp.currentUrl = data.url;
		Utils.changeUrl(id, data.url);
    this.id = id;
    this.viewer =  new APP.Viewer(id, container, navigation, data);
    this.filters =  new APP.Filters(data.filters);
    this.listeners();
				var filterRight = $('.filter.right')
				var rightSelect = $('.filter.right .am-Select')

				$(rightSelect).click(function () {
					var state = filterRight.attr('data-state')
					if(state == 'closed') filterRight.attr('data-state', 'open')
					else filterRight.attr('data-state', 'closed')
				})

				var filterLeft = $('.filter.left')
				var leftSelect = $('.filter.left .am-Select')
				var discoverContent = $('.discover-content')

				$(leftSelect).click(function () {
					var state = filterLeft.attr('data-state')
					if(state == 'closed') {
						filterLeft.attr('data-state', 'open')
						discoverContent.attr('data-state', 'expand').trigger('resetLayout')
					}
					else{
						filterLeft.attr('data-state', 'closed')
						discoverContent.attr('data-state', 'reduce').trigger('resetLayout')
					}
				})

				var device = new Device({
													toDesktop: function () {
														console.log('toDesktop!')
													},
													toMobile: function () {
														console.log('toMobile!')
														$('.filter.left .left-menu').css('display', 'block')
													}
												})

				if(device.getVal() == "mobile") {
					$(leftSelect).trigger( "click" )
					$('.filter.left .left-menu').css('display', 'block')
				}


			function Device (options) {

				var val = window.innerWidth < 1000 ? 'mobile' : 'desktop',
				    toDesktop = options.toDesktop,
				    toMobile = options.toMobile;


				window.addEventListener('resize', function(){

					var temp = val;

					val = window.innerWidth < 1000 ? 'mobile' : 'desktop';

					if(temp == 'mobile' && val == 'desktop') toDesktop();
					if(temp == 'desktop' && val == 'mobile') toMobile();
				});

				function getVal () { return val; }

				return {
				    getVal: getVal
				};
			}
};

APP.DiscoverScreen.constructor = APP.DiscoverScreen;

APP.DiscoverScreen.prototype.listeners = function() {
  Broadcaster.addEventListener('FILTER_CHANGED', this.filterChangedHandler.bind(this));
};

APP.DiscoverScreen.prototype.filterChangedHandler = function(event) {
  $('.am-navigation-text').text(event.newValue);
  Utils.changeUrl(this.id, DataApp.currentUrl);
  this.viewer.reset();
};
