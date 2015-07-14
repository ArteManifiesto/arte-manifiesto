
function CompileProfile () {

	var username = document.querySelector('input[name="username"]'),
			city = document.querySelector('input[name="city"]'),
			country = document.querySelector('input[name="country"]'),
			gender = document.querySelector('select[name="gender"]'),
			birthday = document.querySelector('input[name="birthday"]'),
			facebook = document.querySelector('input[name="facebook"]'),
			twitter = document.querySelector('input[name="twitter"]'),
			behance = document.querySelector('input[name="behance"]'),
			tumblr = document.querySelector('input[name="tumblr"]'),
			manifest = document.querySelector('textarea'),

			saveButton = document.querySelector('.button-solid');

			console.log('saveButton', saveButton)

	function setup () {

		saveButton.addEventListener('click', function () {

			// console.log('username', username.value)
			// console.log('city', city.value)
			// console.log('country', country.value)
			// console.log('gender', gender.value)
			// console.log('birthday', birthday.value)
			// console.log('facebook', facebook.value)
			// console.log('twitter', twitter.value)
			// console.log('behance', behance.value)
			// console.log('tumblr', tumblr.value)
			// console.log('manifest', manifest.value)
			// console.log('interests', options.getSelecteds())
			// console.log('specialties', options2.getSelecteds())

			var data = {
				"photo":"http://www.juliocanares.com/cv/headshot.png",
				"username": username.value,
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

			console.log('data: ', data)

			$.ajax({
			     type: "POST",
			     contentType: "application/json; charset=utf-8",
    			 dataType : "json",
			     url: '/auth/complete',
			     data: JSON.stringify(data),
			     success: function (response) {

						console.log('response: ', response)

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
			if(selected == 'true') ret.push(i)
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
			if(selected == 'true') ret.push(i)
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
var compileProfile = new CompileProfile()