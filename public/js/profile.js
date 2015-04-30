// console.log('hola desde profile.js')

function Profile (data) {
	
	var id = data.id;

	var workTemplate = _.template( $( "#work-template" ).html() );
	var artistTemplate = _.template( $( "#artist-template" ).html() );
	var productTemplate = _.template( $( "#product-template" ).html() );

	var profileMenuItems = document.querySelectorAll('.square-menu__item');

	var pages = document.querySelectorAll('.page')

	var followed = 	false
	var followButton = document.querySelector('.js-followButton')
	var followersEl = followButton.querySelector('.button-liner__number');

	var url = null;

	var currentPage = 0

	function setup () {
		
		rederPortfolio()

		followButton.addEventListener('click', function () {

			if(!user){
				location.href = '/auth/login'
				return
			}

			if(followed) unFollow()
			else follow()
		})

		profileMenuItems[0].addEventListener('click', function () {
			rederPortfolio()
			pages[currentPage].style.display = 'none'
			currentPage = 0
			pages[currentPage].style.display = 'block'
		})
		profileMenuItems[2].addEventListener('click', function () {
			rederLikes()
			// console.log('currentPage: ', currentPage)
			pages[currentPage].style.display = 'none'
			currentPage = 2
			pages[currentPage].style.display = 'block'

		})
		profileMenuItems[3].addEventListener('click', function () {
			rederFollowers()
			pages[currentPage].style.display = 'none'
			currentPage = 3
			pages[currentPage].style.display = 'block'
		})
		profileMenuItems[4].addEventListener('click', function () {
			rederFollowing()
			pages[currentPage].style.display = 'none'
			currentPage = 4
			pages[currentPage].style.display = 'block'
		})

	}

	function follow () {
		console.log('follow')

		$.post('/' + user.username + '/follow/', {idUser: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				followed = true
				followButton.classList.add('disabled')
				followers = data.data.followers
				followersEl.innerHTML = followers
			}
		})

	}

	function unFollow() {
		$.post('/' + user.username + '/unfollow/', {idUser: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				followed = false
				followButton.classList.remove('disabled')
				followers = data.data.followers
				followersEl.innerHTML = followers
			}
		})
	}


	function rederPortfolio () {
		currentPath = 'portfolio'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		console.log('url: ', url)
		$.post( url, function( data ) {
			console.log('data: ', data)
			var worksContainer = document.querySelector('.profile-content__works .works')
			addWorks(worksContainer, data.works)
		});
	}

	function rederLikes () {
		currentPath = 'likes/works'
		// currentPath = 'likes/products'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		console.log('url: ', url)
		$.post( url, function( data ) {
			console.log('data: ', data)
				var worksContainer = document.querySelector('.profile-content__likes .works')
				addWorks(worksContainer, data.likes)
				// var productsContainer = document.querySelector('.profile-content__likes .products')
				// addProducts(productsContainer, data.likes)
		});
	}

	function rederFollowers () {
		currentPath = 'followers'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		console.log('url: ', url)
		$.post( url, function( data ) {
			console.log('data: ', data)
			console.log('data.followers: ', data.followers)
			var artistsContainer = document.querySelector('.profile-content__followers .artists')
			console.log('artistsContainer: ', artistsContainer)
			addArtists(artistsContainer, data.followers)
		});
	}

	function rederFollowing () {
		currentPath = 'followings'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		console.log('url: ', url)
		$.post( url, function( data ) {
			console.log('data: ', data)
				var artistsContainer = document.querySelector('.profile-content__following .artists')
				console.log('artistsContainer: ', artistsContainer)
				addArtists(artistsContainer, data.followings)
		});
	}

	function addWorks (worksContainer, works) {
		clear(worksContainer, 'work')

		for (var i = 0; i < works.length; i++) {
			var work = makeEl(workTemplate, works[i])
			salvattore['append_elements'](worksContainer, [work])
		}
	}
	function addArtists (artistsContainer, artists) {
		console.log('addArtists')
		clear(artistsContainer, 'artist-wrapper')

		for (var i = 0; i < artists.length; i++) {
			var work = makeEl(artistTemplate, artists[i])
			artistsContainer.appendChild(work)
		}
	}
	function addProducts (productsContainer, products) {
		console.log('addProducts')
		clear(productsContainer, 'product-wrapper')

		for (var i = 0; i < products.length; i++) {
			var product = makeEl(productTemplate, products[i])
			productsContainer.appendChild(product)
		}
	}

	function clear (container, className) {
		   var els = container.querySelectorAll('.' + className)
        for (var i = 0; i < els.length; i++)
            els[i].remove()
	}

	setup()
}

var p = new Profile({
	id: profile.id
})