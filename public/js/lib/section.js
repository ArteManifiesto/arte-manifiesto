
function Section (data) {

	var path = data.path

	var container = document.querySelector('.' + data.containerClass)
	var	template = _.template( $( "#" + data.templateId ).html() )
	
	var mainFilter = data.mainFilter
	var parameters = data.parameters

	var moreSection = document.querySelector('.more')
	var moreButton = moreSection.querySelector('.button-solid')
	
	var emptyResult = document.querySelector('.empty-result')
	var loading = document.querySelector('.loading')

	var scrollMode = false

	var idUser = user.id || 0

	var wrapper = document.querySelector('.main-wrapper')

	var searchers = data.searchers

	var navigation = document.querySelector('.section__navigation')
	var navigationText = document.querySelector('.js-navigation-text')

	var createObject = data.createObject

	function setup () {
		
		var searchEl = document.querySelector('.search')
		var search = new Search(searchEl)

		searchEl.addEventListener('search', function () {
			changeSearch(search.values().text, search.values().url)
			navigationText.innerHTML = search.values().text
			navigation.classList.add('visible')
		})

		window.history.pushState({}, "", url)
		
		window.onscroll = function() {
			if ((window.innerHeight + window.scrollY) >= wrapper.offsetHeight)
				if(scrollMode) nextPage()
		}

		moreButton.addEventListener('click', initScroll)

		var mainFilters = document.querySelectorAll('.' + mainFilter.name)

		for (var i = mainFilters.length - 1; i >= 0; i--) {
			mainFilters[i].addEventListener('click', function () {
				changeMainFilter(this.getAttribute('data-value'))
			})
		}

		for (var i = parameters.length - 1; i >= 0; i--) {
			var parametersFilter = document.querySelectorAll('.' + parameters[i].name)
			setupParameters(parametersFilter, parameters[i].url)
		};
	}

	function setupParameters (parameters, partialUrl) {
		for (var i = parameters.length - 1; i >= 0; i--) {
			parameters[i].addEventListener('click', function () {
				changeParameter(this.getAttribute('data-value'), partialUrl)
			})
		};
	}

	function changeParameter (value, partialUrl) {

		var currentValue = getUrlParameter(partialUrl)

		if (currentValue != undefined)
			url = url.replace(currentValue, value)
		else
			url += '&' + partialUrl + '=' + value
		url = url.replace('page-' + pagination.page, 'page-1')
		url = url.replace(path , 'search/' + path)

		resetElements()
		
		getElements(url, function (elements) {
			renderElements(elements)
		})
	}

	function changeSearch (value, partialUrl) {
		
		for (var i = searchers.length - 1; i >= 0; i--) {
			var val = getUrlParameter(searchers[i]);
			if (val != undefined)
				url = url.replace('&' + searchers[i] + '=' + val, '')
		}

		if(value.length > 0)
			url += '&' + partialUrl + '=' + value

		url = url.replace('page-' + pagination.page, 'page-1')
		url = url.replace(path , 'search/' + path)

		resetElements()
		
		getElements(url, function (elements) {
			renderElements(elements)
		})

	}

	function changeMainFilter (value) {

		var currentValue = url.split('/')[5]
		url =	url.replace('specialty/' + currentValue, 'specialty/' + value)
		url = url.replace('page-' + pagination.page, 'page-1')
		url = url.replace(path , 'search/' + path)
		
		resetElements()

		getElements(url, function (elements) {
			renderElements(elements)
		})
	}

	function resetElements () {
		container.innerHTML = ""
		emptyResult.classList.remove('visible')
		moreSection.classList.add('hidden')
		scrollMode = false
	}

	function nextPage (callback) {

		if(pagination.page == pagination.pages) return

		url = url.replace(path , 'search/' + path)
		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)

		getElements(url, function (elements) {
			addElements(elements)
			if(callback) callback()
		})
	}

	function getElements (newUrl, callback) {

		loading.classList.add('visible')

		$.post( newUrl, {idUser: idUser}, function( data ) {
			loading.classList.remove('visible')

			url = data.url
			window.history.pushState({}, "", url)
			
			pagination = data.pagination
			callback(data[path])
		})
	}
	
	function initScroll () {
		moreSection.classList.add('hidden')
		nextPage(function () { scrollMode = true })
	}

	function addElements (elements) {
		for (var i = 0; i < elements.length; i++) {
			var object = makeObject(template, elements[i])
			// console.log('elements[i]: ', elements[i])
			// console.log('object: ', object)
			createObject(object, elements[i])
			container.appendChild(object)
		}
	}

	function renderElements (elements) {
		if(elements.length != 0){
			addElements(elements)
			if(pagination.page < pagination.pages)
				moreSection.classList.remove('hidden')
			return
		}
		emptyResult.classList.add('visible')
	}

	setup()
}

function makeObject (template, data) {
	var objectString = template(data)
	var div = document.createElement('div')
	div.innerHTML = objectString
	return div.children[0]
}

function getUrlParameter(sParam) {
	// var sPageURL = window.location.search.substring(1)
	var sPageURL = window.location.search.substring(1)
	var sURLVariables = sPageURL.split('&')
	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=')
		if (sParameterName[0] == sParam)
			return sParameterName[1]
	}
}