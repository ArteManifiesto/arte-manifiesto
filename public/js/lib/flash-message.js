function FlasMessage (el) {

	var flash = el.querySelector('.flash-message')
	var flashText = el.querySelector('.flash-message .text')
	var closed = el.querySelector('.fa')

	closed.addEventListener('click', function () {
		el.style.display = 'none'
	})

	function hide () {
		el.style.display = 'none'
	}

	function show (type, text) {
		flash.classList.remove('error')
		flash.classList.remove('success')

		flash.classList.add(type)
		flashText.innerHTML = text
		el.style.display = 'block'
	}

	return {
		hide: hide,
		show: show
	}
}