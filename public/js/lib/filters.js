
function LayoutFilters (data) {

	var leftFiltersButton 	= document.querySelector('.' + data.leftFiltersButtonClass),
			rightFiltersButton 	= document.querySelector('.' + data.rightFiltersButtonClass),

			leftFilters 	= document.querySelector('.' + data.leftFiltersClass),
			rightFilters  = document.querySelector('.' + data.rightFiltersClass),
			works 				= document.querySelector('.' + data.worksClass),

			leftVisible = false,
			rightVisible = false;

	leftFiltersButton.addEventListener('click', function () {
		if(leftVisible) hideLeft()
		else showLeft()
	})

	rightFiltersButton.addEventListener('click', function () {
		if(rightVisible) hideRight()
		else showRight()
	})

	function hideLeft () {		
		leftFilters.classList.remove('visible')
		works.classList.remove('moveLeft')
		leftVisible = false
	}
	function showLeft () {
		leftFilters.classList.add('visible')
		works.classList.add('moveLeft')
		leftVisible = true
	}

	function hideRight () {
		rightFilters.classList.remove('visible')
		works.classList.remove('moveRight')
		rightVisible = false
	}
	function showRight () {
		rightFilters.classList.add('visible')
		works.classList.add('moveRight')
		rightVisible = true
	}
}

new LayoutFilters({
	leftFiltersButtonClass: 'js-leftFiltersButton',
	rightFiltersButtonClass: 'js-rightFiltersButton',
	leftFiltersClass: 'js-leftFilters',
	rightFiltersClass: 'js-rightFilters',
	worksClass: 'js-works'
})


function Filters (el, data) {
	
	var filterItems = el.querySelectorAll('.' + data.filterItemsClass),
			pos = data.pos || 0

	for (var i = 0; i < filterItems.length; i++)
		filterItems[i].setAttribute('index', i)

	for (var i = 0; i < filterItems.length; i++)
		filterItems[i].addEventListener('click', function () {
			var index = this.getAttribute('index')
			filterItems[pos].classList.remove('selected')
			pos = index
			filterItems[pos].classList.add('selected')
		})
}

var filterList = document.querySelectorAll('.filters')

for (var i = 0; i < filterList.length; i++)
	new Filters(filterList[i], {
		filterItemsClass: 'filter'
	})