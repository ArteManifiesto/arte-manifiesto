// console.log('hola desde profile.js')

function Profile () {
	
	// var worksContainer = document.querySelector('.works'),
	var workTemplate = _.template( $( "#work-template" ).html() );
	var artistTemplate = _.template( $( "#artist-template" ).html() );
	var productTemplate = _.template( $( "#product-template" ).html() );

	var profileMenuItems = document.querySelectorAll('.square-menu__item')

	var url = null;

	function setup () {

		// if(currentPath == 'portfolio') rederPortfolio()
		
		profileMenuItems[0].addEventListener('click', rederPortfolio)
		// profileMenuItems[1].addEventListener('click', rederMarket)
		profileMenuItems[2].addEventListener('click', rederLikes)
		// profileMenuItems[3].addEventListener('click', rederCollections)
		// profileMenuItems[4].addEventListener('click', rederFollowing)
		// profileMenuItems[5].addEventListener('click', rederFollowers)

	}

	function rederPortfolio () {
		currentPath = 'portfolio'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		$.post( url, function( data ) {
				var worksContainer = document.querySelector('.profile-content__works .works')
				addWorks(worksContainer, data.works)
		});
	}
	function addWorks (worksContainer, works) {
		for (var i = 0; i < works.length; i++) {
			var work = makeEl(workTemplate, works[i])
			salvattore['append_elements'](worksContainer, [work])
		}
	}

	function rederLikes () {
		currentPath = 'likes/works'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		$.post( url, function( data ) {
				var worksContainer = document.querySelector('.profile-content__likes .works')
				addWorks(worksContainer, data.likes)
		});
	}
	
	function rederLikes () {
		currentPath = 'likes/works'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		$.post( url, function( data ) {
				var worksContainer = document.querySelector('.profile-content__likes .works')
				addWorks(worksContainer, data.likes)
		});
	}



	setup()
}

var p = new Profile()