function Profile (el, data) {

	var templates =[_.template( $( "#work-template" ).html() )]
	var pagination = []

	var paths = ['portfolio']

	var buttons = [data.menus[0], data.menus[1], data.menus[2], data.menus[3], data.menus[4]],
			containers = [data.elements[0], data.elements[1], data.elements[2], data.elements[3], data.elements[4]],
			actives = [false, false, false, false, false]

			pos = 0;

	function setup () {
		
		for (var i = buttons.length - 1; i >= 0; i--)
			buttons[i].setAttribute('index', i)
		
		for (var i = buttons.length - 1; i >= 0; i--) {
			buttons[i].addEventListener('click', function () {
				var index = this.getAttribute('index')
				show(index)
			})
		}
	}

	function show (index) {
		containers[pos].style.display = 'none'
		containers[index].style.display = 'block'
		pos = index
		if(!actives[index]) render(index)
	}

	function render (index) {
		
		url = '/' + profile.username + '/' + paths[index] + '/page-1'
		console.log('url: ', url)

		$.post( url, function( response ) {
			console.log('response: ', response)
			pagination[index] = response.pagination
			renderElements(index, response.works)
			actives[index] = true
		});

	}

	function renderElements (index, elements) {
		if(elements.length != 0){
			addElements(index, elements)
			if(pagination[index].page < pagination[index].pages){
				// containers[index].querySelector('more').classList.remove('hidden')
			}
				// moreSection.classList.remove('hidden')
			return
		}
		// emptyResult[].classList.add('visible')
		// containers[index].querySelector('.empty').style.add('visible')
	}
	
	setup()
}

var menus = document.querySelectorAll('.square-menu__item')
// console.log('menus: ', menus)

var elements = document.querySelectorAll('.profile__element')
// console.log('elements: ', elements)

window.profileObj = new Profile(document.querySelector('.profile'), {
	menus: menus,
	elements: elements
})