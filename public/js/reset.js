
var submit = document.querySelector('input[type=submit]')
var loading = document.querySelector('.loading')
console.log('submit: ', submit)
console.log('loading: ', loading)

var resetForm = document.querySelector('.reset')

resetForm.addEventListener('submit', function (ev) {
	ev.preventDefault()

	var url = location.pathname
	var formData = $(resetForm).serialize()

	submit.style.display = 'none'
	loading.style.display = 'block'

	console.log('url: ', url)
	$.post(url, formData, function (response) {
		console.log('response: ', response)

		if(response.status == 200){
			// reset success
			location.href = response.data.returnTo
		}
	})
})