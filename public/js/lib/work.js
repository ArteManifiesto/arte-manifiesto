
function Work(el, data) {

	// console.log('work', el, data)

	var id = data.id,
			likes = data.likes,
			liked = data.liked,
			featureded = data.featured;

	console.log('liked: ', liked)

	var buttonFeatured = el.querySelector('.' + data.buttonFeaturedClass)
	var buttonliked = el.querySelector('.' + data.buttonLikedClass)
	console.log('buttonliked: ', buttonliked)
	// console.log('buttonFeatured: ', buttonFeatured)

	var clickend = false;

	function setup() {

		if(buttonFeatured)
			buttonFeatured.addEventListener('click', function () {
				if(featureded) featured()
				else unFeatured()
			})

		el.addEventListener('click', function () {

			if(clickend) {
				// console.log('dblclick')
				clickend = false

				if (!user) {
					location.href = '/auth/login'
					return
				}

				if(!liked) like()
				else unLike()

			} else {
	
				clickend = true
				
				setTimeout(function () {
					if(clickend){
						// console.log('click')
						clickend = false
					}
					// else {
					// 	// cancel click ecent
					// }
				}, 400)

			}
		})
	}

	function like () {
		console.log('id', id)
		$.post('/' + user.username + '/work/like/', {idWork: id}, function (data) {
			if (data.status == 200) {
				console.log('liked')
				liked = true
				buttonLiked.classList.remove('hidden')
			}
			console.log(data)
		})
	}

	function unLike () {
		console.log('id', id)
		$.post('/' + user.username + '/work/unlike/', {idWork: id}, function (data) {
			if (data.status == 200) {
				console.log('unliked')
				liked = false
			}
			console.log(data)
		})
	}

	function featured () {
		
	}

	function unFeatured () {
		
	}

	setup()
}
