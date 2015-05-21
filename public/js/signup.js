
var registerForm = $(".js-signUpForm")

var loadingFacebook = document.querySelectorAll('.loading')[0]
var loadingSubmit = document.querySelectorAll('.loading')[1]

var facebookButton = document.querySelector('.facebook-button')
var submitButton = document.querySelector('input[type="submit"]')


facebookButton.addEventListener('click', function () {
	facebookButton.style.display = 'none'
	loadingFacebook.classList.add('visible')
})

registerForm.submit(function () {
	var formData = registerForm.serialize()

	loadingSubmit.classList.add('visible')
	submitButton.style.display = 'none'
	
	$.post('/auth/signup', formData, function (response) {
		loadingSubmit.classList.remove('visible')
		submitButton.style.display = 'block'
		console.log('response: ', response)
	})

	return false
});