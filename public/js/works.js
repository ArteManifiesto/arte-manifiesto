
// function Works () {
	
// 	var works = document.querySelector('.works')
// 	var workTemplate = _.template( $( "#work-template" ).html() )

// 	var currentPage = 1

// 	var moreButton = document.querySelector('.js-moreButton')
// 	// console.log('moreButton: ', moreButton)

// 	var timeFilter = document.querySelector('.time-filter')
// 	console.log('timeFilter: ', timeFilter)

// 	function setup () {
		
// 		timeFilter.addEventListener('change', function () {
// 			console.log('change', this.value)

// 		})

// 		moreButton.addEventListener('click', next)

// 	}

// 	function next () {
		
// 		console.log('next')

// 		currentPage++

// 		var url = '/search/works/category/all/page-' + currentPage + '/?order=popularity'
// 		// var url = '/search/works/category/all/page-2/?order=popularity'
// 		console.log('url: ', url)

// 		var idUser = user.id || 0

// 		$.post( url, {idUser: idUser}, function( data ) {
// 			console.log('data.works: ', data.works)

// 			add(data.works)

// 		})

// 	}

// 	function add (data) {

// 		for (var i = 0; i < data.length; i++) {

// 			var workString = workTemplate(data[i])

// 			var div = document.createElement('div')
// 			div.innerHTML = workString
			
// 			var work = div.children[0]

// 			salvattore['append_elements'](works, [work])
			
// 		}
// 	}

// 	setup()

// 	return this

// }


function Works () {
	
	var worksContainer = document.querySelector('.works')
	var workTemplate = _.template( $( "#work-template" ).html() )

	var category = 'all',
			orderValue = 'popularity',
			timeValue = 'week',
			page = 1;

	var idUser = user.id || 0

	var categoryFilter = document.querySelector('.category-filter')
	// console.log('categoryFilter: ', categoryFilter)

	var orderFilter = document.querySelector('.order-filter')
	// console.log('orderFilter: ', orderFilter)

	var timeFilter = document.querySelector('.time-filter')
	// console.log('timeFilter: ', timeFilter)

	var moreButton = document.querySelector('.js-moreButton')
	// console.log('moreButton: ', moreButton)

	function setup () {
		
		categoryFilter.addEventListener('change', function () {
			changeCategory()
		})
		
		orderFilter.addEventListener('change', function () {
			changeOrder()
		})
		
		timeFilter.addEventListener('change', function () {
			changeTime()
		})

		moreButton.addEventListener('click', function () {
			more()
		})
	}

	function more () {

		page++

		// var url = '/search/works/category/' + category + '/page-' + page + '/?order=' + order + '&time=' +  time


		// $.post( url, {idUser: idUser}, function( data ) {
		// 	add(data.works)
		// })
	}

	function changeCategory () {
		category = categoryFilter.value
		var currentCategory = url.split('/')[5]
		url =	url.replace(currentCategory, category)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData();
	}

	function changeOrder() {
		orderValue = orderFilter.value
    var order = getUrlParameter('order');
		url = url.replace(order, orderValue);
		getData();
	}

	function changeTime () {
		timeValue = timeFilter.value
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
		$.post( url, {idUser: idUser}, function( data ) {
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
