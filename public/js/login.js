
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

		$.post('/auth/login', $(el).serialize(), function (response) {
			console.log('response: ', response)
			submitButton.style.display = 'block'
			loadingSubmit.style.display = 'none'

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

		$.post('/auth/remember', $(el).serialize(), function (response) {
			console.log('response: ', response)
			submitButton.style.display = 'block'
			loadingSubmit.style.display = 'none'

		})
	}

	setup()
}

var loginForm = document.querySelectorAll('.auth__form')[0]
var rememberForm = document.querySelectorAll('.auth__form')[1]

var toRemember = loginForm.querySelector('.italic-text')
var toLogin = rememberForm.querySelector('.italic-text')

window.signup = new Login(loginForm, {})
window.remember = new Remember(rememberForm, {})

toRemember.addEventListener('click', function () {
	console.log('toRemember')
	loginForm.style.display = 'none'
	rememberForm.style.display = 'block'
})

toLogin.addEventListener('click', function () {
	console.log('toLogin')
	loginForm.style.display = 'block'
	rememberForm.style.display = 'none'
})