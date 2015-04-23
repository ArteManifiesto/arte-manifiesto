
function Works () {
	
	var worksContainer = document.querySelector('.works'),
			workTemplate = _.template( $( "#work-template" ).html() );

	var category = 'all',
			orderValue = 'popularity',
			timeValue = 'week',
			page = 1;

	var idUser = user.id || 0

	var categoryList = document.querySelectorAll('.js-category'),
			orderList = document.querySelectorAll('.js-order'),
			timeList = document.querySelectorAll('.js-time'),
			moreButton = document.querySelector('.js-moreButton');

	function setup () {

		for (var i = 0; i < categoryList.length; i++)
			categoryList[i].addEventListener('click', function () {
				changeCategory(this.getAttribute("data-value"))
			})

		for (var i = 0; i < orderList.length; i++)
			orderList[i].addEventListener('click', function () {
				changeOrder(this.getAttribute("data-value"))
			})

		for (var i = 0; i < timeList.length; i++)
			timeList[i].addEventListener('click', function () {
				changeTime(this.getAttribute("data-value"))
			})

		moreButton.addEventListener('click', function () {
			more()
		})
	}

	function more () {
		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)
		getData(true)
	}

	function changeCategory (value) {
		category = value
		var currentCategory = url.split('/')[5]
		url =	url.replace(currentCategory, category)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeOrder(value) {
		orderValue = value
    var order = getUrlParameter('order')
		url = url.replace(order, orderValue)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeTime (value) {
		timeValue = value
		var time = getUrlParameter('time');
		if (time != undefined)
			url = url.replace(time, timeValue);
		else
			url += '&time='+timeValue;
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
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

	function getData(isAdd){
		url = url.replace('works' , 'search/works')
		$.post( url, {idUser: idUser}, function( data ) {
			url = data.url
			if(isAdd) add(data.works)
			else {
				window.history.pushState({}, "", url)
				render(data.works)	
			}
		})
	}
	
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1)
		var sURLVariables = sPageURL.split('&')
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=')
			if (sParameterName[0] == sParam)
				return sParameterName[1]
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
