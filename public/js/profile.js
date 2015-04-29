// console.log('hola desde profile.js')

function Profile () {
	
	var worksContainer = document.querySelector('.works'),
			workTemplate = _.template( $( "#work-template" ).html() );

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
		
		console.log('url: ', url)
		$.post( url, function( data ) {
				console.log(data);

				addWorks(data.works)
		});
	}

	function rederLikes () {
		
		currentPath = 'likes/works'
		url = '/' + profile.username + '/' + currentPath + '/page-1';
		
		console.log('url holi: ', url)
		$.post( url, function( data ) {
				console.log(data);

				// addWorks(data.works)
		});
	}

	function addWorks (works) {
		for (var i = 0; i < works.length; i++) {
			var work = makeEl(workTemplate, works[i])
			salvattore['append_elements'](worksContainer, [work])
		}
	}

	setup()
}

var p = new Profile()