
function Search (el) {

	var input = el.querySelector('input')
	var optionsContainer = el.querySelector('.options')
	var options = optionsContainer.querySelectorAll('.option')
	var optionsText = optionsContainer.querySelectorAll('.search-text')
	var pos = 0
	var visible = false
	var text = ''
	var textContainer = el.querySelector('.text')
	console.log('textContainer', textContainer)
	var closedTextContainer = textContainer.querySelector('i')
	var url
	var event = new Event('search')

	function setup () {

		console.log('textContainer', textContainer)

		closedTextContainer.addEventListener('click', function () {
			console.log('click!')
			console.log('textContainer', textContainer)
			textContainer.style.display = 'none'
		})

		for (var i = 0; i < options.length; i++){
			options[i].setAttribute('index', i)
		}

		for (var i = 0; i < options.length; i++)
			options[i].addEventListener('click', function () {
				options[pos].classList.remove('selected')
				pos = this.getAttribute("index")
				options[pos].classList.add('selected')
				hide()
				url = options[pos].getAttribute("data-search")
				search()
			})

		// input.addEventListener('focusin', function () {
		// 	if(text != '') optionsContainer.classList.add('visible')
		// })

		input.addEventListener('input', function() {
			text = input.value
			if(text!='') {
				if(!visible){
					show()
				}
				for (var i = 0; i < optionsText.length; i++)
					optionsText[i].innerHTML = text
			}
			else hide()
		});

		input.addEventListener('keypress', function (e) {
			var keyCode = e.keyCode || e.which;
			if (keyCode == '13'){
				search()
				hide()
			}
		})
	}

	function hide () {
		optionsContainer.classList.remove('visible')
		visible = false
	}

	function show () {
		url = options[0].getAttribute("data-search")

		options[pos].classList.remove('selected')
		pos = 0
		options[pos].classList.add('selected')

		// optionsContainer.classList.add('visible')

		visible = true
	}

	function search () {
		console.log('serarch!')
		if(text != '') {
			textContainer.querySelector('span').innerHTML = text
			textContainer.style.display = 'block'
		}
		el.dispatchEvent(event)
	}

	function values () {
		return {
			text: text,
			url: url
		}
	}

	setup()

	return {
		values: values
	}
}