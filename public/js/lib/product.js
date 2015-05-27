
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

		if(isMobile()){
			// console.log('Mobile Browser')

		} else {
			// console.log('Desktop Browser');

		}

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
			// var object = makeObject(collectTemplate, response.data)
			// console.log('object: ', object)
			document.querySelector('.products').appendChild(object)

			collect.init(response.data, pos)
		})
	}

	window.collect = new Collect(object, response.data, function (insides) {
			
			console.log('insides: ', insides)
			var url = '/' + user.username + '/product/addToCollection'
			console.log(url)

			$.ajax({
				type: "POST",
				url: url,
				datatype: "json",
				data: JSON.stringify({idProduct: id, collections: insides}),
				success: function (response) {
					console.log(response)
				},
				contentType: "application/json; charset=utf-8",
			});

		})

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
}

function isMobile() {
	// return true

	if (sessionStorage.desktop) // desktop storage
	return false;
	else if (localStorage.mobile) // mobile storage
	return true;

	// alternative
	var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
	for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

	// nothing found.. assume desktop
	return false;
}
