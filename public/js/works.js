
function Works () {
	
	var worksContainer = document.querySelector('.works')
	var workTemplate = _.template( $( "#work-template" ).html() )

	var category = 'all',
			orderValue = 'popularity',
			timeValue = 'week',
			page = 1;

	var idUser = user.id || 0

	var categoryList = document.querySelectorAll('.js-category')
	console.log('categoryList: ', categoryList)

	var orderList = document.querySelectorAll('.js-order')
	console.log('orderList: ', orderList)

	var timeList = document.querySelectorAll('.js-time')
	console.log('timeList: ', timeList)

	// var orderFilter = document.querySelector('.order-filter')
	// console.log('orderFilter: ', orderFilter)

	// var timeFilter = document.querySelector('.time-filter')
	// console.log('timeFilter: ', timeFilter)

	// var moreButton = document.querySelector('.js-moreButton')
	// console.log('moreButton: ', moreButton)

	function setup () {

		for (var i = 0; i < categoryList.length; i++) {
			categoryList[i].addEventListener('click', function () {
				changeCategory(this.getAttribute("data-value"))
			})
		}

		for (var i = 0; i < orderList.length; i++) {
			orderList[i].addEventListener('click', function () {
				changeOrder(this.getAttribute("data-value"))
			})
		}

		for (var i = 0; i < timeList.length; i++) {
			timeList[i].addEventListener('click', function () {
				changeTime(this.getAttribute("data-value"))
			})
		}

		// orderFilter.addEventListener('change', function () {
		// 	changeOrder()
		// })
		
		// timeFilter.addEventListener('change', function () {
		// 	changeTime()
		// })

		// moreButton.addEventListener('click', function () {
		// 	more()
		// })
	}

	function more () {

		page++

		// var url = '/search/works/category/' + category + '/page-' + page + '/?order=' + order + '&time=' +  time

		// $.post( url, {idUser: idUser}, function( data ) {
		// 	add(data.works)
		// })
	}

	function changeCategory (value) {
		// category = categoryFilter.value
		category = value
		var currentCategory = url.split('/')[5]
		url =	url.replace(currentCategory, category)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData();
	}

	function changeOrder(value) {
		// orderValue = orderFilter.value
		orderValue = value
    var order = getUrlParameter('order');
		url = url.replace(order, orderValue);
		getData();
	}

	function changeTime (value) {
		// timeValue = timeFilter.value
		timeValue = value
		var time = getUrlParameter('time');
		if (time != undefined)
			url = url.replace(time, timeValue);
		else
			url += '&time='+timeValue;
		getData();
	}

	function render (works) {
		var currentWorks = worksContainer.querySelectorAll('.work')
		for (var i = 0; i < currentWorks.length; i++)
			currentWorks[i].remove()
		add(works)
	}

	function add (works) {
		for (var i = 0; i < works.length; i++) {
			var work = makeWork(workTemplate, works[i])
			salvattore['append_elements'](worksContainer, [work])
		}
	}

	function getData(){
		url = url.replace('works' , 'search/works');
		console.log('url: ', url)
		
		$.post( url, {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			url = data.url;
			window.history.pushState({}, "", url);
			render(data.works)
		})
	}
	
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1)
		var sURLVariables = sPageURL.split('&')
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=')
			if (sParameterName[0] == sParam) {
				return sParameterName[1]
			}
		}
	}

	setup()

	return {
		add: add,
		render: render
	}
}

function makeWork (workTemplate, workData) {
	var workString = workTemplate(workData)
	var div = document.createElement('div')
	div.innerHTML = workString
	return div.children[0]
}

window.work = new Works()
