
function CompleProfile () {

	var username = document.querySelector('input[name="username"]'),
			firstname = document.querySelector('input[name="firstname"]'),
			lastname = document.querySelector('input[name="lastname"]'),
			city = document.querySelector('input[name="city"]'),
			country = document.querySelector('select[name="country"]'),
			gender = document.querySelector('select[name="gender"]'),
			birthday = document.querySelector('input[name="birthday"]'),
			facebook = document.querySelector('input[name="facebook"]'),
			twitter = document.querySelector('input[name="twitter"]'),
			behance = document.querySelector('input[name="behance"]'),
			tumblr = document.querySelector('input[name="tumblr"]'),
			manifest = document.querySelector('textarea'),

			saveButton = document.querySelector('.button-solid'),
			error = document.querySelector('.error-message');


	function setup () {

		saveButton.addEventListener('click', function () {
			error.style.display = 'none'

			var data = {
				"photo":"/img/artists/artist2.jpg",
				"username": username.value,
				"firstname": firstname.value,
				"lastname": lastname.value,
				"city": city.value,
				"country": country.value,
				"birthday": '05/27/1996',
				"gender": gender.value,
				"facebook": facebook.value,
				"behance": behance.value,
				"tumblr": tumblr.value,
				"twitter": twitter.value,
				"biography": manifest.value,
				"interests": options.getSelecteds(),
				"specialties": options2.getSelecteds()
			}

			if(data.username == ""){
				error.style.display = 'table'
				error.innerHTML = 'escoja su username'
				return
			}
			if(data.firstname == ""){
				error.style.display = 'table'
				error.innerHTML = 'ingrese su nombre'
				return
			}
			if(data.lastname == ""){
				error.style.display = 'table'
				error.innerHTML = 'ingrese su apellido'
				return
			}
			if(data.gender == ""){
				error.style.display = 'table'
				error.innerHTML = 'escoja su genero'
				return
			}
			if(data.country == ""){
				error.style.display = 'table'
				error.innerHTML = 'escoja su pais'
				return
			}

			console.log('data: ', data)

			$.ajax({
			     type: "POST",
			     contentType: "application/json; charset=utf-8",
    			 dataType : "json",
			     url: '/auth/complete',
			     data: JSON.stringify(data),
			     success: function (response) {

						console.log('response: ', response)
						if(response.status == 200) location.reload()

			     }
			  });

		})

	}

	setup()
}


function Options () {

	var options = document.querySelectorAll('.Profile-section-option')

	function setup () {

		for (var i = options.length - 1; i >= 0; i--)
			options[i].setAttribute('selected', false)

		for (var i = options.length - 1; i >= 0; i--) {
			options[i].addEventListener('click', function () {

				var selected = this.getAttribute('selected')

				if(selected == 'true') {
					this.classList.remove('active')
					this.setAttribute('selected', false)
				} else {
					this.classList.add('active')
					this.setAttribute('selected', true)
				}
			})
		}
	}

	function getSelecteds () {
		var ret = []
		for (var i = options.length - 1; i >= 0; i--){
			var selected = options[i].getAttribute('selected')
			if(selected == 'true') {
				var itemId = options[i].getAttribute('data-id')
				console.log('itemId: ', itemId)
				ret.push(itemId)
			}
		}
		return ret
	}

	setup()

	return {
		getSelecteds: getSelecteds
	}
}

function Options2 () {

	var options = document.querySelectorAll('.checkbox-list__item')

	function setup () {

		for (var i = options.length - 1; i >= 0; i--)
			options[i].setAttribute('selected', false)

		for (var i = options.length - 1; i >= 0; i--) {
			options[i].addEventListener('click', function () {

				var selected = this.getAttribute('selected')

				if(selected == 'true') {
					this.classList.remove('active')
					this.setAttribute('selected', false)
					this.querySelector('input').checked = false
				} else {
					this.classList.add('active')
					this.setAttribute('selected', true)
					this.querySelector('input').checked = true
				}
			})
		}
	}

	function getSelecteds () {
		var ret = []
		for (var i = options.length - 1; i >= 0; i--){
			var selected = options[i].getAttribute('selected')
			if(selected == 'true') {
				var itemId = options[i].getAttribute('data-id')
				console.log('itemId: ', itemId)
				ret.push(itemId)
			}
		}
		return ret
	}

	setup()

	return {
		getSelecteds: getSelecteds
	}
}

var options = new Options()
var options2 = new Options2()
var compleProfile = new CompleProfile()