
function Works () {
	
	window.history.pushState({}, "", url)

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
			moreButton = document.querySelector('.js-moreButton'),
			featuredButton = document.querySelector('input[name="question"]');
			console.log('featuredButton: ', featuredButton)

	var searcher = document.querySelector('.js-searcher')
	var searchOptions = document.querySelector('.js-search-options')
	var optionsEl = searchOptions.querySelectorAll('.search-text')
	var looking = false
	var scrollMode = false

	var loading = document.querySelector('.loading')
	var moreContainer = document.querySelector('.more')

	var text = null

	function setup () {

		searcher.addEventListener('keypress', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13'){
				changeTag(text)
			}
		})

		searcher.addEventListener('focusin', function () {
			console.log('focusin')

			var text = searcher.value

			if(text != '') 
				searchOptions.style.display = 'block'
			// searchOptions.style.display = 'none'
		})

		searcher.addEventListener('focusout', function () {
			// console.log('focusout')
			searchOptions.style.display = 'none'
		})

		searcher.addEventListener('input', function() {
			// console.log('searcher changed to: ', searcher.value);
			text = searcher.value
			if(text!='') {
				// console.log('completar')
				searchOptions.style.display = 'block'
				for (var i = 0; i < optionsEl.length; i++) {
					optionsEl[i].innerHTML = text
				};
			}
			else {
				// console.log('retirar')
				searchOptions.style.display = 'none'
			}
		});

		featuredButton.addEventListener('change', function () {
			changeFeatured(featuredButton.checked)
		})

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
			moreContainer.classList.add('hide')
			scrollMode = true
		})

		window.onscroll = function(ev) {
			if(looking) return
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				if(scrollMode) more()
			}
		}
	}


	function more () {

		// console.log('pagination.page', pagination.page)
		// console.log('pagination.pages', pagination.pages)

		if(pagination.page == pagination.pages) return

		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)
		getData(true)
	}

	function changeTag (value) {

		var tag = getUrlParameter('tag');
		if (tag != undefined)
			url = url.replace('tag=' + tag, 'tag=' + value);
		else
			url += '&tag='+value;
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeFeatured (featuredValue) {

		var featured = getUrlParameter('featured')
		console.log('featured: ', featured)

		if(featured == undefined) {
			url = url + '&featured'
		} else {
			// console.log('holi!')
			if(!featuredValue)
				url = url.replace("&featured=", "")
		}
		// console.log(url)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}
	
	function changeCategory (value) {
		category = value
		var currentCategory = url.split('/')[5]
		url =	url.replace('category/'+currentCategory, 'category/'+category)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeOrder(value) {
		orderValue = value
    var order = getUrlParameter('order')
    console.log('order: ', order)
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

		// console.log('pagination.page', pagination.page)
		// console.log('pagination.pages', pagination.pages)
		if(pagination.page < pagination.pages){
			moreContainer.classList.remove('hide')
			scrollMode = false
		} else {
			moreContainer.classList.add('hide')
		}
	}

	function add (works) {
		for (var i = 0; i < works.length; i++) {
			var work = makeWork(workTemplate, works[i])
			salvattore['append_elements'](worksContainer, [work])
		}
	}

	function getData(isAdd){
		url = url.replace('works' , 'search/works')

		looking = true
		loading.style.display = 'block'

		console.log('url: ', url)
		$.post( url, {idUser: idUser}, function( data ) {
			console.log(data)

			loading.style.display = 'none'

			looking = false

			url = data.url

			// console.log('data.pagination: ', data.pagination)
			pagination = data.pagination
			// console.log('pagination: ', pagination)
			
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

window.works = new Works()