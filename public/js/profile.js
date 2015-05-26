function Profile (el, data) {

	var templates =[_.template($( "#work-template" ).html()),
									_.template($( "#product-template" ).html()),
									_.template($( "#work-template" ).html()),
									_.template($( "#product-template" ).html()),
									null,
									_.template($( "#user-template" ).html()),
									_.template($( "#user-template" ).html())]
	var paginations = []

	var paths = ['portfolio',
							 'products',
							 'products',
							 'products',
							 'products',
							 'followers',
							 'followings']

	var buttons = data.menus,
			containers = data.elements,
			actives = [false, false, false, false, false, false, false]

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
			paginations[index] = response.pagination
			console.log('index: ', index)
			if(index == 0) renderElements(index, response.works)
			if(index == 1) renderElements(index, response.products)
			// if(index == 2) renderElements(index, response.products)
			// if(index == 3) renderElements(index, response.products)
			// if(index == 4) renderElements(index, response.products)
			if(index == 5) renderElements(index, response.followers)
			if(index == 6) renderElements(index, response.followings)
			actives[index] = true
		});

	}

	function renderElements (index, elements) {
		console.log('renderElements', index, elements)
		if(elements.length != 0){
			addElements(index, elements)
			if(paginations[index].page < paginations[index].pages){
				// containers[index].querySelector('more').classList.remove('hidden')
			}
				// moreSection.classList.remove('hidden')
			return
		}
		// emptyResult[].classList.add('visible')
		// containers[index].querySelector('.empty').style.add('visible')
	}

	function addElements (index, elements) {
		for (var i = 0; i < elements.length; i++) {
			var object = makeObject(templates[index], elements[i])
			console.log('object: ', object)
			// createObject(object, elements[i])

			if(index != 0){
				// containers.appendChild(object)
				console.log('container: ', containers[index].children[0])
				containers[index].children[0].appendChild(object)
			}
			else{
				console.log('container: ', containers[index].children[0])
				salvattore['append_elements'](containers[index].children[0], [object])
				// salvattore['append_elements'](containers[index], [object])
			}
		}
	}

	function makeObject (template, data) {
		var objectString = template(data)
		var div = document.createElement('div')
		div.innerHTML = objectString
		return div.children[0]
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