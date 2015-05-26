function Profile (el, data) {

	var templates =[_.template($( "#work-template" ).html()),
									_.template($( "#product-template" ).html()),
									_.template($( "#work-template" ).html()),
									_.template($( "#product-template" ).html()),
									_.template($( "#collection-template" ).html()),
									_.template($( "#user-template" ).html()),
									_.template($( "#user-template" ).html())]

	var paginations = []

	var paths = ['portfolio',
							 'store',
							 '',
							 'likes/products',
							 'collections',
							 'followers',
							 'followings']

	var buttons = data.menus,
			containers = data.elements,
			pos = 0;

	function setup () {
		console.log('path: ', path)

		if(!path || path == 'portfolio' ) pos = 0

		// if(path == 'portfolio') pos = 0
		// if(path == 'portfolio') pos = 0
		// if(path == 'portfolio') pos = 0
		// if(path == 'portfolio') pos = 0
		// if(path == 'portfolio') pos = 0

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
		render(index)
	}

	function render (index) {
		
		url = '/' + profile.username + '/' + paths[index] + '/page-1'
		// console.log('url: ', url)
		var newUrl = '/' + profile.username + '/' + paths[index]

		clear(index)

		containers[index].querySelector('.loading').style.display = 'block'
		containers[index].querySelector('.empty').style.display = 'none'

		$.post( url, function( response ) {
			containers[index].querySelector('.loading').style.display = 'none'
			console.log('response: ', response)
			
			paginations[index] = response.pagination
			window.history.pushState({}, "", newUrl)

			if(index == 0) renderElements(index, response.works)
			if(index == 1) renderElements(index, response.products)
			// if(index == 2) renderElements(index, response.products)
			if(index == 3) renderElements(index, response.products)
			if(index == 4) renderElements(index, response.collections)
			if(index == 5) renderElements(index, response.followers)
			if(index == 6) renderElements(index, response.followings)
			
			// actives[index] = true
		});
	}

	function renderElements (index, elements) {
		// console.log('renderElements', index, elements)
		if(elements.length != 0){
			addElements(index, elements)
			if(paginations[index].page < paginations[index].pages){
				// containers[index].querySelector('more').classList.remove('hidden')
			}
				// moreSection.classList.remove('hidden')
			return
		}
		containers[index].querySelector('.empty').style.display = 'block'
	}

	function addElements (index, elements) {
		for (var i = 0; i < elements.length; i++) {
			var object = makeObject(templates[index], elements[i])
			// console.log('object: ', object)
			// createObject(object, elements[i])
			if(index == 1) new Product(object, elements[i])
			if(index == 3) new Product(object, elements[i])
			// if(index == 4) new Collection(object, elements[i])
			if(index == 5) new User(object, elements[i])
			if(index == 6) new User(object, elements[i])

			if(index != 0)
				containers[index].children[0].appendChild(object)
			else
				salvattore['append_elements'](containers[index].children[0], [object])
		}
	}

	function makeObject (template, data) {
		var objectString = template(data)
		var div = document.createElement('div')
		div.innerHTML = objectString
		return div.children[0]
	}
	function clear (index) {

		if(index == 0) var els = containers[index].querySelectorAll('.work')
		if(index == 1) var els = containers[index].querySelectorAll('.product-wrapper')
		// if(index == 2) var els = containers[index].querySelectorAll('.work')
		if(index == 3) var els = containers[index].querySelectorAll('.product-wrapper')
		if(index == 4) var els = containers[index].querySelectorAll('.collection-wrapper')
		if(index == 5) var els = containers[index].querySelectorAll('.user-wrapper')
		if(index == 6) var els = containers[index].querySelectorAll('.user-wrapper')

		for (var i = 0; i < els.length; i++)
			els[i].remove()
	}

	setup()
}

var menus = document.querySelectorAll('.square-menu__item')

var elements = document.querySelectorAll('.profile__element')

window.profileObj = new Profile(document.querySelector('.profile'), {
	menus: menus,
	elements: elements
})

new User(document.querySelector('.profile__info'), profile)