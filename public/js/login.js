
function Login (container, data) {

	var openSignUpButton = document.querySelector('.' + data.signUpButtonClass)
	var openSignInButton = document.querySelector('.' + data.signInButtonClass)

	var signUpFormButton = container.querySelector('.' + data.signUpFormButtonClass)
	var signInFormButton = container.querySelector('.' + data.signInFormButtonClass)
	
	var signUpForm = container.querySelector('.' + data.signUpFormClass)
	var signInForm = container.querySelector('.' + data.signInFormClass)

	var html = document.querySelector('html');
	var loginBox = container.querySelector('.' + data.loginBoxClass)

	function setup () {

		if(openSignUpButton) openSignUpButton.addEventListener('click', openSignUp)
		if(openSignInButton) openSignInButton.addEventListener('click', openSignIn)

		signUpFormButton.addEventListener('click', openSignUpForm)
		signInFormButton.addEventListener('click', openSignInForm)
		
		loginBox.addEventListener('click', function (e) { e.stopPropagation() } )
		container.addEventListener('click', closed)
	}

	function openSignUp () {
		container.style.display = 'block'
		html.style.overflow = 'hidden'
		openSignUpForm()
	}
	function openSignIn () {
		container.style.display = 'block'
		html.style.overflow = 'hidden'
		openSignInForm()
	}

	function openSignUpForm () {
		signUpForm.style.display = 'block'
		signInForm.style.display = 'none'
		
		signUpFormButton.classList.add('active')
		signInFormButton.classList.remove('active')
	}
	function openSignInForm () {
		signInForm.style.display = 'block'
		signUpForm.style.display = 'none'

		signInFormButton.classList.add('active')
		signUpFormButton.classList.remove('active')
	}

	function closed () {
		container.style.display = 'none'
		html.style.overflow = 'auto'
	}

	setup()

	return {
		openSignIn: openSignIn,
		openSignUp: openSignUp,
		openSignInForm: openSignInForm,
		openSignUpForm: openSignUpForm,
		closed: closed
	}
}


window.login = new Login(document.querySelector('.login-modal'), {
	signUpButtonClass: 'js-signUpButton',
	signInButtonClass: 'js-signInButton',
	signUpFormButtonClass: 'js-signUpFormButton',
	signInFormButtonClass: 'js-signInFormButton',
	signUpFormClass: 'js-signUpForm',
	signInFormClass: 'js-signInForm',
	loginBoxClass: 'js-loginBox'
})
