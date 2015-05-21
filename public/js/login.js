// console.log('submitLogin: ', submitLogin)

var loginForm = $(".js-loginForm")
var rememberForm = $(".js-rememberForm")

var loadingFacebook = document.querySelectorAll('.loading')[0]
var loadingLogin = document.querySelectorAll('.loading')[1]
var loadingRemember = document.querySelectorAll('.loading')[2]

var facebookButton = document.querySelector('.facebook-button')
var submitLogin = document.querySelectorAll('input[type="submit"]')[0]
var submitRegister = document.querySelectorAll('input[type="submit"]')[1]

var openRememberForm = document.querySelectorAll('.italic-text')[0]
var openLoginForm = document.querySelectorAll('.italic-text')[1]

var filterLeftButton = document.querySelectorAll('.button-filter')[0]
var filterRightButton = document.querySelectorAll('.button-filter')[1]
console.log('filterLeftButton: ', filterLeftButton)
console.log('filterRightButton: ', filterRightButton)

var filterLeft = document.querySelectorAll('.section__workspace__filter')[0]
var filterRight = document.querySelectorAll('.section__workspace__filter')[1]
console.log('filterLeft: ', filterLeft)
console.log('filterRight: ', filterRight)

facebookButton.addEventListener('click', function () {
	facebookButton.style.display = 'none'
	loadingFacebook.classList.add('visible')
})

loginForm.submit(function () {
	var formData = loginForm.serialize()

	loadingLogin.classList.add('visible')
	submitLogin.style.display = 'none'
	
	$.post('/auth/login', formData, function (response) {
		loadingLogin.classList.remove('visible')
		submitLogin.style.display = 'block'
		console.log('response: ', response)
	})

	return false
});

openLoginForm.addEventListener('click', function () {
	console.log('joli!')
	rememberForm.css('display', 'none')
	loginForm.css('display', 'block')
})

openRememberForm.addEventListener('click', function () {
	console.log('joli!')
	loginForm.css('display', 'none')
	rememberForm.css('display', 'block')
})