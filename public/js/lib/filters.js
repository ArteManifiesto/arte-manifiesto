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

	var leftVisible = false
	var rightVisible = false

	leftFiltersButton.addEventListener('click', function () {
		if(leftVisible){
			// hideLeftFilters()
			leftFilters.classList.remove('visible')
			leftVisible = false
		} else {
			// showLeftFilters()
			leftFilters.classList.add('visible')
			leftVisible = true
		}
	})

	rightFiltersButton.addEventListener('click', function () {
		if(rightVisible){
			// hideRightFilters()
			rightFilters.classList.remove('visible')
			rightVisible = false
		} else {
			// showRightFilters()
			rightFilters.classList.add('visible')
			rightVisible = true
		}
	})

}

window.filters = new Filters({}, {
	leftFiltersButtonClass: 'js-leftFiltersButton',
	rightFiltersButtonClass: 'js-rightFiltersButton',
	leftFiltersClass: 'js-leftFilters',
	rightFiltersClass: 'js-rightFilters'
})