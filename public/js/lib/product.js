
function Product (el, data) {
	console.log('el: ', el)
	console.log('data: ', data)

	var id = data.id,

			likes = data.likes,
			liked = data.liked,

			buttonLike = el.querySelector('.' + data.buttonLikeClass),
			likesEl = buttonLike.querySelector('span');
			console.log('buttonLike: ', buttonLike)


	function setup () {

		buttonLike.addEventListener('click', function () {
			// console.log('click')
			if(!liked) like()
			else unLike()
		})
	}

	function like () {
		// console.log('like')
		buttonLike.classList.add('active')
		liked = true

		// get new likes in response
		newLikes = likes + 1

		likes = newLikes
		likesEl.innerHTML = likes
	}

	function unLike () {
		// console.log('unLike')
		buttonLike.classList.remove('active')
		liked = false
		
		// get new likes in response
		newLikes = likes - 1
		
		likes = newLikes
		likesEl.innerHTML = likes
	}

	setup()
}