
window.login = new Login(document.querySelector('.login-modal'), {
	signUpButtonClass: 'js-signUpButton',
	signInButtonClass: 'js-signInButton',
	signUpFormButtonClass: 'js-signUpFormButton',
	signInFormButtonClass: 'js-signInFormButton',
	signUpFormClass: 'js-signUpForm',
	signInFormClass: 'js-signInForm',
	loginBoxClass: 'js-loginBox'
})


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
    console.log("login response : ", response);
    if (response.code == 202) {
        location.href = '/dashboard';
    }
}