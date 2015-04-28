
function Artists (data) {

	window.history.pushState({}, "", url)
	
	var prefix = data.prefix,
			makeObject = data.makeObject;

	var artistsContainer = document.querySelector('.artists'),
			artistTemplate = _.template( $( "#artist-template" ).html() );

	var page = 1;

	var idUser = user.id || 0 // Se puede presindir de ell, asi como en el /follow

	var categorys = document.querySelectorAll('.js-category'),
			orders = document.querySelectorAll('.js-order'),
			times = document.querySelectorAll('.js-time'),
			moreButton = document.querySelector('.js-moreButton')
			featuredButton = document.querySelector('input[name="question"]');
			console.log('featuredButton: ', featuredButton)

	var searcher = document.querySelector('.js-searcher')
	var searchOptions = document.querySelector('.js-search-options')
	var optionsEl = searchOptions.querySelectorAll('.search-option')
	console.log('optionsEl: ', optionsEl)
	var optionTextsEl = searchOptions.querySelectorAll('.search-text')
	var navigation = document.querySelector('.navigation')
	var navigationTexts = document.querySelectorAll('.navigation-text')

	var looking = false
	var scrollMode = false

	var loading = document.querySelector('.loading')
	var moreContainer = document.querySelector('.more')

	var text = ''
	var type = null

	function setup () {

		// Selected option
		for (var i = 0; i < optionsEl.length; i++)
			optionsEl[i].addEventListener('click', function () {
				type = this.getAttribute('data-search')
				// console.log('type: ', type)
				if(type == 'name') changeName(text)
				if(type == 'username') changeUsername(text)
			})

		// Enter event in search
		searcher.addEventListener('keypress', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13') changeUsername(text)
			// return false;
		})

		// Open options
		searcher.addEventListener('focusin', function () {
			if(text != '') searchOptions.style.display = 'block'
		})

		// Closed options
		searcher.addEventListener('focusout', function () {
			console.log('focusout')
			setTimeout(function () {
				searchOptions.style.display = 'none'
			}, 150)
		})

		// Change tex
		searcher.addEventListener('input', function() {
			text = searcher.value
			if(text!='') {
				searchOptions.style.display = 'block'
				for (var i = 0; i < optionTextsEl.length; i++)
					optionTextsEl[i].innerHTML = text
			}
			else searchOptions.style.display = 'none'
		});


		featuredButton.addEventListener('change', function () {
			changeFeatured(featuredButton.checked)
		})

		for (var i = 0; i < categorys.length; i++)
			categorys[i].addEventListener('click', function () {
				changeCategory(this.getAttribute("data-value"))
			})

		for (var i = 0; i < orders.length; i++)
			orders[i].addEventListener('click', function () {
				changeOrder(this.getAttribute("data-value"))
			})

		for (var i = 0; i < times.length; i++)
			times[i].addEventListener('click', function () {
				changeTime(this.getAttribute("data-value"))
			})

		moreButton.addEventListener('click', function () {
			more()
			moreContainer.classList.add('hide')
			scrollMode = true
		})

		window.onscroll = function(ev) {
			console.log('onscroll!')
			if(looking) return
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				console.log('bottom!')
				if(scrollMode) more()
			}
		}

	}

	function more () {
		console.log('more')
		if(pagination.page == pagination.pages) return

		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)
		console.log('url: ', url)
		
		getData(true)
	}

	function changeName (value) {

		var username = getUrlParameter('username');
		if (username != undefined)
			url = url.replace('username=' + username, '');

		var name = getUrlParameter('name');
		if (name != undefined)
			url = url.replace('name=' + name, 'name=' + value);
		else
			url += '&name='+value;

		url = url.replace('page-' + pagination.page, 'page-1')
		navigation.style.display = 'block'

		navigationTexts[0].innerHTML = 'Nombre'
		navigationTexts[1].innerHTML = value

		getData(false)
	}

	function changeUsername (value) {

		var name = getUrlParameter('name');
		if (name != undefined)
			url = url.replace('name=' + name, '');

		var username = getUrlParameter('username');
		if (username != undefined)
			url = url.replace('username=' + username, 'username=' + value);
		else
			url += '&username='+value;

		url = url.replace('page-' + pagination.page, 'page-1')
		navigation.style.display = 'block'

		if (value == ''){
			navigation.style.display = 'none'
			url = url.replace('&username=', '');
		}

		searcher.blur()

		navigationTexts[0].innerHTML = 'Username'
		navigationTexts[1].innerHTML = value

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

	function changeCategory (categoryValue) {
		var currentCategory = url.split('/')[5]
		url =	url.replace('specialty/'+currentCategory, 'specialty/'+categoryValue)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeOrder(orderValue) {
		// orderValue = value
    var order = getUrlParameter('order')
		url = url.replace(order, orderValue)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changeTime (timeValue) {
		// timeValue = value
		var time = getUrlParameter('time');
		if (time != undefined)
			url = url.replace(time, timeValue);
		else
			url += '&time='+timeValue;
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function removeEntities (entityClass) {
		// var currentArtists = artistsContainer.querySelectorAll('.artist')
		var entities = artistsContainer.querySelectorAll('.' + entityClass)

		for (var i = 0; i < entities.length; i++)
			entities[i].remove()
	}

	function render (artists) {
		removeEntities('artist-wrapper')
		add(artists)

		if(pagination.page < pagination.pages){
			moreContainer.classList.remove('hide')
			scrollMode = false
		} else {
			moreContainer.classList.add('hide')
		}
	}

	function add (artists) {
		for (var i = 0; i < artists.length; i++) {
			var artist = makeEl(artistTemplate, artists[i])
			// salvattore['append_elements'](artistsContainer, [artist])

			artistsContainer.appendChild(artist)

			makeObject(artist, artists[i])
		}
	}

	function getData(isAdd){
		// url = url.replace('users' , 'search/users')
		url = url.replace(prefix , 'search/' + prefix)

		looking = true
		loading.style.display = 'block'
		
		console.log('url: ', url)
		$.post( url, {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			loading.style.display = 'none'

			looking = false

			url = data.url

			// console.log('data.pagination: ', data.pagination)
			pagination = data.pagination

			if(isAdd) add(data.users)
			else {
				window.history.pushState({}, "", url)
				render(data.users)
			}
		})
	}

	setup()
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