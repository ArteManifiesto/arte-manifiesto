
function Product (el, data) {

	var id = data.id,

		likes = data.likes,
		liked = data.liked,

		buttonLike = el.querySelector('.button-like'),
		likesEl = buttonLike.querySelector('span'),

		buttonCollect = el.querySelector('.wish-list');


	function setup () {

		if(isMobile()){
			// console.log('Mobile Browser')

		} else {
			// console.log('Desktop Browser');

		}

		buttonLike.addEventListener('click', function () {
			if (!user) {
				location.href = '/auth/login/?returnTo=' + location.href
				return
			}
			if (!liked) like()
			else unLike()
		})

		buttonCollect.addEventListener('click', function (e) {
			if (!user) {
				location.href = '/auth/login/?returnTo=' + location.href
				return
			}
			var pos = [e.pageX, e.pageY]
			getCollects(pos)
		})
	}


	function getCollects (pos) {

		var url = '/' + user.username + '/collection/all'

		$.post(url, {idProduct: id}, function (response) {
			collect.init(response.data, id, pos)
		})
	}

	function like () {

		var url = '/' + user.username + '/product/like'

		$.post(url, {idProduct: id}, function (data) {

			if (data.status == 200) {
				buttonLike.classList.add('active')
				buttonLike.classList.add('disabled')
				liked = true

				var newLikes = data.data.likes
				likes = newLikes
				likesEl.innerHTML = likes
			}
		})
	}

	function unLike () {

		var url = '/' + user.username + '/product/unlike'

		$.post(url, {idProduct: id}, function (data) {

			if (data.status == 200) {
				buttonLike.classList.remove('active')
				buttonLike.classList.remove('disabled')
				liked = false

				var newLikes = data.data.likes
				likes = newLikes
				likesEl.innerHTML = likes
			}
		})
	}

	setup()
}

function Collect (el) {

	var itemTemplate = _.template( $( "#item-template" ).html() )

	var collectsData
	var list = el.querySelector('.checkbox-list')
	var collectsEl
	var save = el.querySelector('.button-solid')
	var idProduct
	var input = el.querySelector('input')
	var newText = el.querySelector('.new-text')
	var addWrapp = el.querySelector('.add-wrapp')
	var closeInput = addWrapp.querySelector('.fa')
	console.log('closeInput: ', closeInput)

	newText.addEventListener('click', function () {
		addWrapp.classList.add('visible')
		newText.style.display = 'none'
	})
	closeInput.addEventListener('click', function () {
		addWrapp.classList.remove('visible')
		newText.style.display = 'block'
		input.value = ''
	})

	el.addEventListener('click', function (event) {
  	event.stopPropagation()
	})

	document.addEventListener('click', function () {
		el.style.display = 'none'
	})

	save.addEventListener('click', function () {

		var insides = getInsides()

		el.classList.add('load')

		if(input.value){
			console.log('create collection')
			
			var url = '/' + user.username + '/collection/create'
			console.log('url: ', url)

			$.post(url, {name: input.value}, function (response) {
				console.log('response: ', response)
				
				if(response.status == 200) {
					console.log('creacion exitosa')
					insides.push(response.data.collection.id)
					// addToCollections
					addToCollections(insides)
				} else {
					console.log('creacion fallida')
				}
			})
		} else {
			// addToCollections
			addToCollections(insides)
		}
	})

	function addToCollections (insides) {

		var url = '/' + user.username + '/product/addToCollection'

		$.ajax({
			type: "POST",
			url: url,
			datatype: "json",
			data: JSON.stringify({idProduct: idProduct, collections: insides}),
			success: function (response) {
				console.log(response)
				el.classList.remove('load')
				el.style.display = 'none'
				
				addWrapp.classList.remove('visible')
				newText.style.display = 'block'
				input.value = ''
			},
			contentType: "application/json; charset=utf-8",
		});
	}

	function init (data, id, pos) {

		idProduct = id

		collectsData = data.collections
		
		list.innerHTML = ''

		for (var i = 0; i < collectsData.length; i++) {
			var object = makeObject(itemTemplate, collectsData[i])
			list.appendChild(object)
		}

		el.style.display = 'block'

		var position = $(".products").offset();

		var collectHeight = $(".collect").outerHeight()
		var collectWidth = $(".collect").outerWidth()

		var warpperHeight = $(".products").outerHeight()
		var warpperWidth = $(".products").outerWidth()

		var limit = position.left + warpperWidth

		if(pos[0] + collectWidth > limit) {
			$(".collect").offset({ top: pos[1]-collectHeight, left: pos[0]-collectWidth })
		} else {
			$(".collect").offset({ top: pos[1]-collectHeight, left: pos[0] })
		}

		collectsEl = el.querySelectorAll('.checkbox-list__item')

		for (var i = collectsEl.length - 1; i >= 0; i--)
			collectsEl[i].setAttribute('index', i)

		for (var i = collectsEl.length - 1; i >= 0; i--)
			collectsEl[i].addEventListener('click', function () {
				var index = this.getAttribute('index')

				if(collectsData[index].productInside) collectsEl[index].classList.remove('active')
				else collectsEl[index].classList.add('active')

				collectsData[index].productInside = collectsData[index].productInside?false:true
			})
	}

	function getInsides () {
		var ret = []
		for (var i = collectsData.length - 1; i >= 0; i--) {
			if(collectsData[i].productInside) ret.push(collectsData[i].id)
		};
		return ret
	}

	return {
		init: init
	}
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

function makeObject (template, data) {
	var objectString = template(data)
	var div = document.createElement('div')
	div.innerHTML = objectString
	return div.children[0]
}
