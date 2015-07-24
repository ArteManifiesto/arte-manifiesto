function Profile (el, data) {

	var index

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
							 'likes/works',
							 'likes/products',
							 'collections',
							 'followers',
							 'followings']

	var buttons = data.menus,
			containers = data.elements,
			pos = 0;

	var wrapper = document.querySelector('.main-wrapper')

	var more = document.querySelector('.more')
	var scrollMode = false
	var page

	function setup () {

		window.onscroll = function() {
			if ((window.innerHeight + window.scrollY) >= wrapper.offsetHeight){
				if(scrollMode) nextPage()
			}
		}

		more.addEventListener('click', initScroll)

		if(!currentPath) pos = 0
		else {
			for (var i = paths.length - 1; i >= 0; i--) {
				if(paths[i] == currentPath) pos = i
			}
		}

		index = pos
		show()

		for (var i = buttons.length - 1; i >= 0; i--)
			buttons[i].setAttribute('index', i)

		for (var i = buttons.length - 1; i >= 0; i--) {
			buttons[i].addEventListener('click', function () {
				var indexValue = this.getAttribute('index')
				index = indexValue
				show()
			})
		}
	}

	function initScroll () {
		more.classList.add('hidden')
		nextPage(function () { scrollMode = true })
	}

	function nextPage (callback) {

		if(paginations[index].page == paginations[index].pages) return

		url = '/' + profile.username + '/' + paths[index] + '/page-' + ++page

		containers[index].querySelector('.loading').style.display = 'block'

		console.log('url: ', url)
		$.post( url, function( response ) {
			console.log('response: ', response)

			if(callback) callback()
			containers[index].querySelector('.loading').style.display = 'none'

			paginations[index] = response.pagination

			if(index == 0) addElements(response.works)
			if(index == 1) addElements(response.products)
			if(index == 2) addElements(response.works)
			if(index == 3) addElements(response.products)
			if(index == 4) addElements(response.collections)
			if(index == 5) addElements(response.followers)
			if(index == 6) addElements(response.followings)

		});
	}

	function show () {
		containers[pos].style.display = 'none'
		containers[index].style.display = 'block'
		pos = index
		render()
	}

	function render () {

		url = '/' + profile.username + '/' + paths[index] + '/page-1'
		page = 1
		var newUrl = '/' + profile.username + '/' + paths[index]
		scrollMode = false

		clear()

		containers[index].querySelector('.loading').style.display = 'block'
		containers[index].querySelector('.empty').style.display = 'none'
		more.classList.add('hidden')

		console.log('url: ', url)
		$.post( url, function( response ) {
			console.log('response: ', response)

			containers[index].querySelector('.loading').style.display = 'none'

			paginations[index] = response.pagination
			window.history.pushState({}, "", newUrl)

			if(index == 0) renderElements(response.works)
			if(index == 1) renderElements(response.products)
			if(index == 2) renderElements(response.works)
			if(index == 3) renderElements(response.products)
			if(index == 4) renderElements(response.collections)
			if(index == 5) renderElements(response.followers)
			if(index == 6) renderElements(response.followings)
		});
	}

	function renderElements (elements) {
		if(elements.length != 0){
			addElements(elements)
			if(paginations[index].page < paginations[index].pages){
				more.classList.remove('hidden')
			}
			return
		}
		containers[index].querySelector('.empty').style.display = 'block'
	}

	function addElements (elements) {

		for (var i = 0; i < elements.length; i++) {
			var object = makeObject(templates[index], elements[i])
			if(index == 0) new Work(object, elements[i])
			if(index == 1) new Product(object, elements[i])
			if(index == 2) new Work(object, elements[i])
			if(index == 3) new Product(object, elements[i])
			// if(index == 4) new Collection(object, elements[i])
			if(index == 5) new User(object, elements[i])
			if(index == 6) new User(object, elements[i])

			if(index != 0 && index != 2)
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

	function clear () {

		if(index == 0) var els = containers[index].querySelectorAll('.work')
		if(index == 1) var els = containers[index].querySelectorAll('.product-wrapper')
		if(index == 2) var els = containers[index].querySelectorAll('.work')
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

// window.collect = new Collect(document.querySelector('.collect'))