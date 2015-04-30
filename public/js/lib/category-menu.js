function CategoryMenu (el, data) {
	console.log('CategoryMenu')

	var items = el.querySelectorAll('.thick-menu__item')
	console.log('items: ', items)

	var currentIndex = 0

	for (var i = 0; i < items.length; i++) {
		items[i].setAttribute('data-index', i)
	};

	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener('click', function () {
			console.log(this)
			
			var index = this.getAttribute('data-index')
			console.log('index: ', index)

			items[currentIndex].classList.remove('selected')
			items[index].classList.add('selected')
			currentIndex = index
		})
	};

}

new CategoryMenu(document.querySelector('.thick-menu'), {})