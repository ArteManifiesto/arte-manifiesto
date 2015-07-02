
function Signup (el, data) {

	// var imputs = [el.querySelector('input[name="username"]'),
	// 							el.querySelector('input[name="email"]'),
	var imputs = [el.querySelector('input[name="email"]'),
								el.querySelector('input[name="password"]'),
								el.querySelector('input[name="firstname"]'),
								el.querySelector('input[name="lastname"]')]

	// var errors = [el.querySelector('.username-error'),
	var errors = [el.querySelector('.email-error'),
								el.querySelector('.password-error'),
								el.querySelector('.firstname-error'),
								el.querySelector('.lastname-error')]

	// var actives = [false, false, false, false, false]
	var actives = [false, false, false, false]

	// var valids = [false, false, false, false, false]
	var valids = [false, false, false, false]

	// var evals = [evalUsername, evalEmail, evalPassword, evalFirstname, evalLastname]
	var evals = [evalEmail, evalPassword, evalFirstname, evalLastname]

	var facebookButton = el.querySelector('.facebook-button'),
			loadingFacebook = el.querySelectorAll('.loading')[0];

	var submitButton = el.querySelector('input[type="submit"]'),
			loadingSubmit = el.querySelectorAll('.loading')[1];


	function setup () {

		// for (var i = 0; i < 5; i++) imputs[i].setAttribute('index', i)
		for (var i = 0; i < 4; i++) imputs[i].setAttribute('index', i)

		// for (var i = 0; i < 5; i++) {
		for (var i = 0; i < 4; i++) {
			imputs[i].addEventListener('focusout', function () {
				console.log('focusout!')
				var index = this.getAttribute('index')
				if(this.value){
					actives[index] = true
					evals[index](this.value)
				}
			})
			imputs[i].addEventListener('input', function () {
				var index = this.getAttribute('index')
				if(actives[index]) evals[index](this.value)
			})
		};

		facebookButton.addEventListener('click', function () {
			facebookButton.style.display = 'none'
			loadingFacebook.style.display = 'block'
		})

		el.addEventListener('submit', function (ev) {
			ev.preventDefault()
			submit()
		})
	}

	function submit () {

		var submit = true

		// for (var i = 4; i >= 0; i--) {
		for (var i = 3; i >= 0; i--) {
			if(!valids[i]){
				actives[i] = true
				evals[i](imputs[i].value)
				imputs[i].focus()
				submit = false
			}
		}

		if(submit){
			submitButton.style.display = 'none'
			loadingSubmit.style.display = 'block'

			var serilizeData = $(el).serialize()
			if(!(serilizeData.indexOf("&isArtist=true") > -1)) serilizeData += '&isArtist=false'

			// console.log('serilizeData: ', serilizeData)
			$.post('/auth/signup', serilizeData, function (response) {
				// console.log('response: ', response)

				if(response.status === 409){
					grecaptcha.reset()
					submitButton.style.display = 'block'
					loadingSubmit.style.display = 'none'
				}
				if(response.status == 200){
					window.location.href = response.data.returnTo
				}
			})
		}
	}

	// function evalUsername (value) {

	// 	hide(errors[0])

	// 	if(value){
	// 		$.post('/auth/check/?property=username&value=' + value, function (response) {
	// 			// console.log('response: ', response)
	// 			if(!response.data.available){
	// 				show(errors[0], value + ' ya esta en uso')
	// 				valids[0] = false
	// 			} else {
	// 				valids[0] = true
	// 			}
	// 		})
	// 	} else {
	// 		show(errors[0], 'campo requerido')
	// 		valids[0] = false
	// 	}
	// }

	function evalEmail (value) {

		hide(errors[0])

		if(value){
			if(validateEmail(value)){
				$.post('/auth/check/?property=email&value=' + value, function (response) {
					// console.log('response: ', response)
					if(!response.data.available){
						show(errors[0], value + ' ya esta en uso')
						valids[0] = false
					} else {
						valids[0] = true
					}
				})
			} else {
				show(errors[0], 'formato incorrecto')
				valids[0] = false
			}
		} else {
			show(errors[0], 'campo requerido')
			valids[0] = false
		}
	}

	function evalPassword (value) {

		hide(errors[1])

		if(value){
			if(value.length < 6){
				show(errors[1], 'minimo 6 caracteres')
				valids[1] = false
			} else {
				valids[1] = true
			}
		} else {
			show(errors[1], 'campo requerido')
			valids[1] = false
		}
	}

	function evalFirstname (value) {

		hide(errors[2])

		if(value){
			valids[2] = true
		} else {
			show(errors[2], 'campo requerido')
			valids[2] = false
		}
	}

	function evalLastname (value) {

		hide(errors[3])

		if(value){
			valids[3] = true
		} else {
			show(errors[3], 'campo requerido')
			valids[3] = false
		}
	}

	function validateEmail(email) {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email)
	}

	function hide (el) {
		el.style.display = 'none'
	}

	function show (el, text) {
		el.style.display = 'block'
		el.innerHTML = text
	}

	setup()
}

function Login (el, data) {

	var facebookButton = el.querySelector('.facebook-button'),
			loadingFacebook = el.querySelectorAll('.loading')[0];

	var submitButton = el.querySelector('input[type="submit"]'),
			loadingSubmit = el.querySelectorAll('.loading')[1];

	function setup () {
		facebookButton.addEventListener('click', function () {
			facebookButton.style.display = 'none'
			loadingFacebook.style.display = 'block'
		})

		el.addEventListener('submit', function (ev) {
			ev.preventDefault()
			submit()
		})
	}

	function submit () {
		submitButton.style.display = 'none'
		loadingSubmit.style.display = 'block'
		flashMessage.hide()

		$.post('/auth/login', $(el).serialize(), function (response) {
			console.log('response: ', response)

			if(response.status == 400){
				submitButton.style.display = 'block'
				loadingSubmit.style.display = 'none'
				// flashMessage.show('error', response.data.message)
				flashMessage.show('error', 'Email o password incorrecto')
			}

			if(response.status == 200){
				window.location.href = response.data.returnTo
			}
		})
	}

	setup()
}

function Remember (el, data) {

	var submitButton = el.querySelector('input[type="submit"]'),
			loadingSubmit = el.querySelectorAll('.loading')[0];

	function setup () {
		el.addEventListener('submit', function (ev) {
			ev.preventDefault()
			submit()
		})
	}

	function submit () {
		submitButton.style.display = 'none'
		loadingSubmit.style.display = 'block'
		flashMessage.hide()

		$.post('/auth/forgot', $(el).serialize(), function (response) {
			// console.log('response: ', response)
			submitButton.style.display = 'block'
			loadingSubmit.style.display = 'none'

			if(response.status == 400){
				flashMessage.show('error', response.data)
			}

			if(response.status == 200){
				flashMessage.show('success', response.data)
			}
		})
	}

	setup()
}