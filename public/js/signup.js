
function Signup (el, data) {
	
	console.log('el: ', el)

	var username = el.querySelector('input[name="username"]'),
			usernameError = el.querySelector('.username-error'),
			usernameActive = false,
			validUsername = false;

	var email = el.querySelector('input[name="email"]'),
			emailError = el.querySelector('.email-error'),
			emailActive = false,
			validEmail = false;

	var password = el.querySelector('input[name="password"]'),
			passwordError = el.querySelector('.password-error'),
			passwordActive = false,
			validPassword = false;

	var firstname = el.querySelector('input[name="firstname"]'),
			firstnameError = el.querySelector('.firstname-error'),
			firstnameActive = false,
			validFirstname = false;

	var lastname = el.querySelector('input[name="lastname"]'),
			lastnameError = el.querySelector('.lastname-error'),
			lastnameActive = false,
			validLastname = false;


	function setup () {
		username.addEventListener('focusout', function () {
			if(this.value){
				usernameActive = true
				evalUsername(this.value)
			}
		})
		username.addEventListener('input', function () {
			if(usernameActive) evalUsername(this.value)
		})

		email.addEventListener('focusout', function () {
			if(this.value){
				emailActive = true
				evalEmail(this.value)
			}
		})
		email.addEventListener('input', function () {
			if(emailActive) evalEmail(this.value)
		})

		password.addEventListener('focusout', function () {
			if(this.value){
				passwordActive = true
				evalPassword(this.value)
			}
		})
		password.addEventListener('input', function () {
			if(passwordActive) evalPassword(this.value)
		})

		firstname.addEventListener('focusout', function () {
			if(this.value){
				firstnameActive = true
				evalFirstname(this.value)
			}
		})
		firstname.addEventListener('input', function () {
			if(firstnameActive) evalFirstname(this.value)
		})

		lastname.addEventListener('focusout', function () {
			if(this.value){
				lastnameActive = true
				evalLastname(this.value)
			}
		})
		lastname.addEventListener('input', function () {
			if(lastnameActive) evalLastname(this.value)
		})

		el.addEventListener('submit', function (ev) {
			ev.preventDefault()
			submit()
		})
	}

	function submit () {
		var submit = true

		if(!validLastname){
			lastnameActive = true
			evalLastname(lastname.value)
			lastname.focus()
			submit = false
		}
		if(!validFirstname){
			firstnameActive = true
			evalFirstname(firstname.value)
			firstname.focus()
			submit = false
		}
		if(!validPassword){
			passwordActive = true
			evalPassword(password.value)
			password.focus()
			submit = false
		}
		if(!validEmail){
			emailActive = true
			evalEmail(email.value)
			email.focus()
			submit = false
		}
		if(!validUsername){
			usernameActive = true
			evalUsername(username.value)
			username.focus()
			submit = false
		}

		if(submit){	
			$.post('/auth/signup', $(el).serialize(), function (response) {
				console.log('response: ', response)
				if(response.status === 409){
					grecaptcha.reset();
				}
				if(response.status == 200){
					window.location.href = response.data.callback
				}
			})
		}
	}

	function evalUsername (value) {

		hide(usernameError)

		if(value){
			$.post('/auth/check/?property=username&value=' + value, function (response) {
				// console.log('response: ', response)
				if(!response.data.available){
					show(usernameError, value + ' ya esta en uso')
					validUsername = false
				} else {
					validUsername = true
				}
			})
		} else {
			show(usernameError, 'campo requerido')
			validUsername = false
		}
	}

	function evalEmail (value) {
		
		hide(emailError)

		if(value){
			if(validateEmail(value)){
				$.post('/auth/check/?property=email&value=' + value, function (response) {
					// console.log('response: ', response)
					if(!response.data.available){
						show(emailError, value + ' ya esta en uso')
						validEmail = false
					} else {
						validEmail = true
					}
				})
			} else {
				show(emailError, 'formato incorrecto')
				validEmail = false
			}
		} else {
			show(emailError, 'campo requerido')
			validEmail = false
		}
	}

	function evalPassword (value) {

		hide(passwordError)

		if(value){
			if(value.length < 6){
				show(passwordError, 'minimo 6 caracteres')
				validPassword = false
			} else {
				validPassword = true
			}
		} else {
			show(passwordError, 'campo requerido')
			validPassword = false
		}
	}

	function evalFirstname (value) {

		hide(firstnameError)

		if(value){
			validFirstname = true
		} else {
			show(firstnameError, 'campo requerido')
			validFirstname = false
		}
	}

	function evalLastname (value) {

		hide(lastnameError)

		if(value){
			validLastname = true
		} else {
			show(lastnameError, 'campo requerido')
			validLastname = false
		}
	}

	function validateEmail(email) {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return re.test(email);
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

window.signup = new Signup(document.querySelector('.auth__form'), {})


// var registerForm = $(".js-signUpForm")

// var loadingFacebook = document.querySelectorAll('.loading')[0]
// var loadingSubmit = document.querySelectorAll('.loading')[1]

// var facebookButton = document.querySelector('.facebook-button')
// var submitButton = document.querySelector('input[type="submit"]')

// facebookButton.addEventListener('click', function () {
// 	facebookButton.style.display = 'none'
// 	loadingFacebook.classList.add('visible')
// })

// registerForm.submit(function () {
// 	var formData = registerForm.serialize()

// 	loadingSubmit.classList.add('visible')
// 	submitButton.style.display = 'none'
	
// 	$.post('/auth/signup', formData, function (response) {
// 		loadingSubmit.classList.remove('visible')
// 		submitButton.style.display = 'block'

// 		if(response.status === 409){
// 			grecaptcha.reset();
// 		}

// 		if(response.status == 200){
// 			window.location.href = response.data.callback
// 		}
// 		console.log('response: ', response)
// 	})

// 	return false
// });