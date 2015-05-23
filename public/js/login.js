
var flashMessage = new FlasMessage(document.querySelector('.flash-message-container'))

var loginForm = document.querySelectorAll('.auth__form')[0]
var rememberForm = document.querySelectorAll('.auth__form')[1]

var toRemember = loginForm.querySelector('.italic-text')
var toLogin = rememberForm.querySelector('.italic-text')

window.signup = new Login(loginForm, {})
window.remember = new Remember(rememberForm, {})

toRemember.addEventListener('click', function () {
	// console.log('toRemember')
	flashMessage.hide()
	loginForm.style.display = 'none'
	rememberForm.style.display = 'block'
})

toLogin.addEventListener('click', function () {
	// console.log('toLogin')
	flashMessage.hide()
	loginForm.style.display = 'block'
	rememberForm.style.display = 'none'
})