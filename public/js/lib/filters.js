// console.log('filters')

function Filters (container, data) {

	var leftFiltersButton = document.querySelector('.' + data.leftFiltersButtonClass)
	var rightFiltersButton = document.querySelector('.' + data.rightFiltersButtonClass)
	// console.log('leftFiltersButton: ', leftFiltersButton)
	// console.log('rightFiltersButton: ', rightFiltersButton)

	var leftFilters = document.querySelector('.' + data.leftFiltersClass)
	var rightFilters = document.querySelector('.' + data.rightFiltersClass)
	// console.log('leftFilters: ', leftFilters)
	// console.log('rightFilters: ', rightFilters)

	var works = document.querySelector('.' + data.worksClass)
	// console.log('works: ', works)

	var leftVisible = false
	var rightVisible = false

	leftFiltersButton.addEventListener('click', function () {
		if(leftVisible){
			leftFilters.classList.remove('visible')
			works.classList.remove('moveLeft')
			leftVisible = false
		} else {
			leftFilters.classList.add('visible')
			works.classList.add('moveLeft')
			leftVisible = true
		}
	})

	rightFiltersButton.addEventListener('click', function () {
		if(rightVisible){
			// hideRightFilters()
			rightFilters.classList.remove('visible')
			works.classList.remove('moveRight')
			rightVisible = false
		} else {
			// showRightFilters()
			rightFilters.classList.add('visible')
			works.classList.add('moveRight')
			rightVisible = true
		}
	})
}

window.filters = new Filters({}, {
	leftFiltersButtonClass: 'js-leftFiltersButton',
	rightFiltersButtonClass: 'js-rightFiltersButton',
	leftFiltersClass: 'js-leftFilters',
	rightFiltersClass: 'js-rightFilters',
	worksClass: 'js-works'
})


function Filter (el, data) {
	
	var filterItems = el.querySelectorAll('.' + data.filterItemsClass)
	// console.log('filterItems: ', filterItems)

	var pos = data.pos || 0

	for (var i = 0; i < filterItems.length; i++) {
		filterItems[i].setAttribute('index', i)
	};

	for (var i = 0; i < filterItems.length; i++) {
		filterItems[i].addEventListener('click', function () {
			var index = this.getAttribute('index')
			// console.log('index: ', index)

			filterItems[pos].classList.remove('selected')
			pos = index
			filterItems[pos].classList.add('selected')

		})
	};

}

var filterList = document.querySelectorAll('.filters')

for (var i = 0; i < filterList.length; i++) {
	
	window.filter = new Filter(filterList[i], {
		filterItemsClass: 'filter'
	})
}