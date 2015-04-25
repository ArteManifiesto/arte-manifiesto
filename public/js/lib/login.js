
var loginForm = $(".js-signInForm");

loginForm.submit(function () {
    $.ajax({
        type: "POST",
        url: "/auth/login",
        data: loginForm.serialize(),
        success: loginSuccessHandler
    });
    return false;
});

function loginSuccessHandler(response) {
    // console.log("login response : ", response);
    if (response.code == 202) {
        location.href = '/dashboard';
    }
}

var registerForm = $(".js-signUpForm");

registerForm.submit(function () {
    // console.log('registerForm.submit')
    $.ajax({
        type: "POST",
        url: "/auth/signup",
        data: registerForm.serialize(),
        success: registerSuccessHandler
    });
    return false;
});

function registerSuccessHandler(response) {
    // console.log('registerSuccessHandler')
    // console.log("register response : ", response);
    if (response.code == 202) {
        location.href = '/dashboard';
    }
}


/*------------------------------------------------------------------------------------------------------------*
	$ DEPURADO---------------------------------------------------------------------------------------------------
*------------------------------------------------------------------------------------------------------------*/
console.log('LOGIN!')

function Login (container, data) {

	var openSignUpButton = document.querySelector('.' + data.signUpButtonClass)
	var openSignInButton = document.querySelector('.' + data.signInButtonClass)

	var loginBox = container.querySelector('.' + data.loginBoxClass)

	var signUpFormButton = loginBox.querySelector('.' + data.signUpFormButtonClass)
	var signInFormButton = loginBox.querySelector('.' + data.signInFormButtonClass)
	var rememberFormButton = loginBox.querySelector('.' + data.rememberFormButtonClass)
	var rememberBackButton = loginBox.querySelector('.' + data.rememberBackButtonClass)
	// console.log('signInFormButton: ', signInFormButton)
	
	var signUpForm = loginBox.querySelector('.' + data.signUpFormClass)
	var signInForm = loginBox.querySelector('.' + data.signInFormClass)
	var rememberForm = loginBox.querySelector('.' + data.rememberFormClass)

	var loginClosed = loginBox.querySelector('.' + data.loginClosedClass)
	console.log('loginClosed: ', loginClosed)

	var html = document.querySelector('html')

	function setup () {

		if(openSignUpButton) openSignUpButton.addEventListener('click', openSignUp)
		if(openSignInButton) openSignInButton.addEventListener('click', openSignIn)

		signUpFormButton.addEventListener('click', openSignUpForm)
		signInFormButton.addEventListener('click', openSignInForm)
		rememberFormButton.addEventListener('click', openRememberForm)
		rememberBackButton.addEventListener('click', openSignInForm)
		
		loginBox.addEventListener('click', function (e) { e.stopPropagation() } )
		container.addEventListener('click', closed)
		loginClosed.addEventListener('click', closed)
		
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
		rememberForm.style.display = 'none'
		
		signUpFormButton.classList.add('active')
		signInFormButton.classList.remove('active')
	}
	function openSignInForm () {
		signInForm.style.display = 'block'
		signUpForm.style.display = 'none'
		rememberForm.style.display = 'none'

		signInFormButton.classList.add('active')
		signUpFormButton.classList.remove('active')
	}
	function openRememberForm () {
		// signUpForm.style.display = 'none'
		signInForm.style.display = 'none'
		rememberForm.style.display = 'block'

		// signInFormButton.classList.add('active')
		// signUpFormButton.classList.remove('active')
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
	rememberFormButtonClass: 'js-rememberFormButton',
	rememberBackButtonClass: 'js-rememberBackButton',
	signUpFormClass: 'js-signUpForm',
	signInFormClass: 'js-signInForm',
	rememberFormClass: 'js-rememberForm',
	loginBoxClass: 'js-loginBox',
	loginClosedClass: 'js-loginClosed'
})