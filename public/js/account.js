
var options1 = document.querySelectorAll('.js-options1')
var options2 = document.querySelectorAll('.js-options2')

for (var i = options1.length - 1; i >= 0; i--) {
	options1[i].setAttribute('selected', false)
	var input = options1[i].querySelector('input')
	input.checked = false
}
for (var i = options2.length - 1; i >= 0; i--) {
	options2[i].setAttribute('selected', false)
	var input = options2[i].querySelector('input')
	input.checked = false
}

for (var i = interests.length - 1; i >= 0; i--) {
	var id = interests[i].id,
			li = document.querySelector('.js-options1[data-id="' + id + '"]'),
			input = li.querySelector('input')

	li.setAttribute('selected', true)
	input.checked = true
}
for (var i = specialties.length - 1; i >= 0; i--) {
	var id = specialties[i].id,
			li = document.querySelector('.js-options2[data-id="' + id + '"]'),
			input = li.querySelector('input')

	li.setAttribute('selected', true)
	input.checked = true
}

function Account () {

	var username = document.querySelector('input[name="username"]'),
			firstname = document.querySelector('input[name="firstname"]'),
			lastname = document.querySelector('input[name="lastname"]'),
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

	function setup () {

		saveButton.addEventListener('click', function () {

			var data = {
				"photo":"http://www.juliocanares.com/cv/headshot.png",
				"username": username.value,
				"firstname": firstname.value,
				"lastname": lastname.value,
				"city": city.value,
				"country": country.value,
				"birthday": '05/27/1996',
				"gender": 'male',
				"facebook": facebook.value,
				"behance": behance.value,
				"tumblr": tumblr.value,
				"twitter": twitter.value,
				"biography": '17-05-1990',
				"interests": options1.getSelecteds(),
				"specialties": options2.getSelecteds()
			}

			console.log('data: ', data)

			$.ajax({
			     type: "POST",
			     contentType: "application/json; charset=utf-8",
    			 dataType : "json",
			     url: '/' + user.username + '/account/',
			     data: JSON.stringify(data),
			     success: function (response) {
						console.log('response: ', response)
			     }
			  });
		})
	}

	setup()
}

function Options (options) {

	function setup () {

		for (var i = options.length - 1; i >= 0; i--) {
			options[i].addEventListener('click', function () {

				var selected = this.getAttribute('selected')

				if(selected == 'true') {
					this.setAttribute('selected', false)
					this.querySelector('input').checked = false
				} else {
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

var options1 = new Options(document.querySelectorAll('.js-options1'))
var options2 = new Options(document.querySelectorAll('.js-options2'))
var account = new Account()



			// console.log('username', username)
			// console.log('name', name)
			// console.log('lastname', lastname)
			// console.log('city', city)
			// console.log('country', country)
			// console.log('gender', gender)
			// console.log('birthday', birthday)
			// console.log('facebook', facebook)
			// console.log('twitter', twitter)
			// console.log('behance', behance)
			// console.log('tumblr', tumblr)
			// console.log('manifest', manifest)
			// console.log('interests', options.getSelecteds())
			// console.log('specialties', options2.getSelecteds())


			// console.log('username', username.value)
			// console.log('name', name.value)
			// console.log('lastname', lastname.value)
			// console.log('city', city.value)
			// console.log('country', country.value)
			// console.log('gender', gender.value)
			// // console.log('birthday', birthday.value)
			// console.log('facebook', facebook.value)
			// console.log('twitter', twitter.value)
			// console.log('behance', behance.value)
			// console.log('tumblr', tumblr.value)
			// console.log('manifest', manifest.value)
			// console.log('interests', options.getSelecteds())
			// console.log('specialties', options2.getSelecteds())