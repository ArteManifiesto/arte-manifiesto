
var loginForm = $(".js-signInForm");
console.log('loginForm: ', loginForm)

loginForm.submit(function () {
		console.log('submit')
    $.ajax({
        type: "POST",
        url: "/auth/login",
        data: loginForm.serialize(),
        success: loginSuccessHandler
    });
    return false;
});

function loginSuccessHandler(response) {
    console.log("login response : ", response);
    if (response.status == 200) {
    	console.log('response.status == 200')
        // location.href = '/dashboard';
        location.href = '/';
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
    if (response.code == 200) {
        // location.href = '/dashboard';
        location.href = '/';
    }
}


/*------------------------------------------------------------------------------------------------------------*
	$ DEPURADO---------------------------------------------------------------------------------------------------
*------------------------------------------------------------------------------------------------------------*/
console.log('LOGIN!')

function Login (data) {

	var mode = data.mode
	console.log('mode: ', mode)

	var modal = document.querySelector('.' + data.modalClass)

	var openSignUpButton = document.querySelector('.' + data.signUpButtonClass)
	var openSignInButton = document.querySelector('.' + data.signInButtonClass)

	// var loginBox = modal.querySelector('.' + data.loginBoxClass)
	var loginBox = document.querySelector('.' + data.loginBoxClass)

	var signUpFormButton = loginBox.querySelector('.' + data.signUpFormButtonClass)
	var signInFormButton = loginBox.querySelector('.' + data.signInFormButtonClass)
	var rememberFormButton = loginBox.querySelector('.' + data.rememberFormButtonClass)
	var rememberBackButton = loginBox.querySelector('.' + data.rememberBackButtonClass)
	
	var signUpForm = loginBox.querySelector('.' + data.signUpFormClass)
	var signInForm = loginBox.querySelector('.' + data.signInFormClass)
	var rememberForm = loginBox.querySelector('.' + data.rememberFormClass)

	var loginClosed = loginBox.querySelector('.' + data.loginClosedClass)
	// console.log('loginClosed: ', loginClosed)

	var html = document.querySelector('html')

	function setup () {

		signUpForm.style.display = 'none'
		signInForm.style.display = 'none'
		rememberForm.style.display = 'none'

		if(mode == 'signin'){
			signInForm.style.display = 'block'
			signInFormButton.classList.add('active')
		}
		if(mode == 'signup'){
			signUpForm.style.display = 'block'
			signUpFormButton.classList.add('active')
		}

		if(openSignUpButton) openSignUpButton.addEventListener('click', openSignUp)
		if(openSignInButton) openSignInButton.addEventListener('click', openSignIn)

		signUpFormButton.addEventListener('click', openSignUpForm)
		signInFormButton.addEventListener('click', openSignInForm)
		rememberFormButton.addEventListener('click', openRememberForm)
		rememberBackButton.addEventListener('click', openSignInForm)
		
		loginBox.addEventListener('click', function (e) { e.stopPropagation() } )
		if(modal) modal.addEventListener('click', closed)
		if(loginClosed) loginClosed.addEventListener('click', closed)
	}

	function openSignUp () {
		if(modal) modal.style.display = 'block'
		html.style.overflow = 'hidden'
		openSignUpForm()
	}
	function openSignIn () {
		if(modal) modal.style.display = 'block'
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
	}

	function closed () {
		modal.style.display = 'none'
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
