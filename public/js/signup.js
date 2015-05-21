
var registerForm = $(".js-signUpForm");

registerForm.submit(function () {
	console.log(registerForm.serialize());
	$.ajax({
		type: "POST",
		url: "/auth/signup",
		data: registerForm.serialize(),
		success: registerSuccessHandler
	});
	return false;
});

function registerSuccessHandler(response) {
	console.log(response);
	if (response.status == 200) {
		console.log('data: ', response.data)
		// location.href = '';
	}
}
