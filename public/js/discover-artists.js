
function Artists () {
	
	var artistsContainer = document.querySelector('.artists'),
			artistTemplate = _.template( $( "#artist-template" ).html() );

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

	function render (artists) {
		var currentArtists = artistsContainer.querySelectorAll('.artist')
		for (var i = 0; i < currentArtists.length; i++)
			currentArtists[i].remove()
		add(artists)
	}

	function add (artists) {
		for (var i = 0; i < artists.length; i++) {
			var artist = makeArtist(artistTemplate, artists[i])

			var buttonFollow = artist.querySelector('.js-followButton')
			console.log('buttonFollow: ', buttonFollow)
		
			var state = buttonFollow.getAttribute('data-following')
			console.log('state == "true": ', (state == "true"))

			window.follow = new Follow(buttonFollow, {
				following: (state == "true")
			})

			salvattore['append_elements'](artistsContainer, [artist])
		}
	}

	function getData(isAdd){
		url = url.replace('users' , 'search/users')
		console.log('url: ', url)

		$.post( url, {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			url = data.url
			if(isAdd) add(data.users)
			else {
				window.history.pushState({}, "", url)
				render(data.users)
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

function makeArtist (artistTemplate, artistData) {
	var artistString = artistTemplate(artistData)
	var div = document.createElement('div')
	div.innerHTML = artistString
	return div.children[0]
}

window.artist = new Artists()