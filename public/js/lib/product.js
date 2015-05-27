
function Product (el, data) {

	var id = data.id,

		likes = data.likes,
		liked = data.liked,

		buttonLike = el.querySelector('.button-like'),
		likesEl = buttonLike.querySelector('span'),

		buttonCollect = el.querySelector('.wish-list'),

		collect = document.querySelector('.collect'),
		collectTemplate = _.template( $( "#collect-template" ).html() );


	function setup () {

		buttonLike.addEventListener('click', function () {
			// console.log('click')
			if (!user) {
				location.href = '/auth/login/?returnTo=' + location.href
				return
			}
			if (!liked) like()
			else unLike()
		})

		buttonCollect.addEventListener('click', function (e) {
			// console.log('e: ', e)
			if (!user) {
				location.href = '/auth/login/?returnTo=' + location.href
				return
			}
			// openCollect()
			getCollects()
		})
	}


	function getCollects () {

		var url = '/' + user.username + '/collection/all'

		$.post(url, {idProduct: id}, function (response) {
			// console.log('response: ', response)
			var object = makeObject(collectTemplate, response.data)
			// console.log('object: ', object)
			document.querySelector('.products').appendChild(object)
			window.collect = new Collect(object, response.data, function (insides) {
				
				console.log('insides: ', insides)
				var url = '/' + user.username + '/product/addToCollection'
				console.log(url)

				$.ajax({
					type: "POST",
					url: url,
					datatype: "json",
					data: JSON.stringify({idProduct: id, idCollections: insides}),
					success: function (response) {
						console.log(response)
					},
					contentType: "application/json; charset=utf-8",
				});

			})
		})
	}

	function like () {

		var url = '/' + user.username + '/product/like'
		console.log(url)

		$.post(url, {idProduct: id}, function (data) {
			console.log(data)

			if (data.status == 200) {
				buttonLike.classList.add('active')
				buttonLike.classList.add('disabled')
				liked = true

				var newLikes = data.data.likes
				likes = newLikes
				console.log('likes :  ', likes);
				likesEl.innerHTML = likes
			}
		})
	}

	function unLike () {

		console.log('unLike')

		var url = '/' + user.username + '/product/unlike'
		console.log(url)

		$.post(url, {idProduct: id}, function (data) {
			console.log(data)

			if (data.status == 200) {
				buttonLike.classList.remove('active')
				buttonLike.classList.remove('disabled')
				liked = false

				var newLikes = data.data.likes
				likes = newLikes
				console.log('likes :  ', likes);
				likesEl.innerHTML = likes
			}
		})
	}

	setup()
}

function makeObject (template, data) {
	var objectString = template(data)
	var div = document.createElement('div')
	div.innerHTML = objectString
	return div.children[0]
}

function Collect (el, data, callback) {
	var collectsData = data.collections
	var collectsEl = el.querySelectorAll('.checkbox-list__item')
	var save = el.querySelector('.button-solid')

	function setup () {
		
		for (var i = collectsEl.length - 1; i >= 0; i--)
			collectsEl[i].setAttribute('index', i)

		for (var i = collectsEl.length - 1; i >= 0; i--)
			collectsEl[i].addEventListener('click', function () {
				var index = this.getAttribute('index')

				if(collectsData[index].productInside) collectsEl[index].classList.remove('active')
				else collectsEl[index].classList.add('active')

				collectsData[index].productInside = collectsData[index].productInside?false:true
			})

		save.addEventListener('click', function () {
			var newInsides = getInsides()
			// console.log('save: ', newInsides)
			callback(newInsides)
		})
	}

	function getInsides () {
		var ret = []
		for (var i = collectsData.length - 1; i >= 0; i--) {
			if(collectsData[i].productInside) ret.push(collectsData[i].id)
		};
		return ret
	}

	setup()

	return {
		getInsides: getInsides
	}
}

	// function collect () {

	// 	var url = '/' + user.username + '/collection/all'

	// 	$.post(url, {idProduct: id}, function (data) {
	// 		console.log('data: ', data)

	// 		for (var i = data.collections.length - 1; i >= 0; i--) {
	// 			data.collections[i]
	// 		};
	// 	})

	// 	// var url = '/' + user.username + '/product/addToCollection'
	// 	// var url = '/' + user.username + '/product/'

	// 	// console.log(url)

	// 	// $.ajax({
	// 	// 	type: "POST",
	// 	// 	url: url,
	// 	// 	datatype: "json",
	// 	// 	data: JSON.stringify({idProduct: id, idCollections: [2, 3]}),
	// 	// 	success: function (responsesl) {
	// 	// 		console.log(responses)
	// 	// 	},
	// 	// 	contentType: "application/json; charset=utf-8",
	// 	// });
	// }