
function Work(el, data) {

	var id = data.id,
			// likes = data.likes,
			liked = data.liked,
			featureded = data.featured;

	// var buttonFeatured = el.querySelector('.' + data.buttonFeaturedClass)
	// var buttonliked = el.querySelector('.' + data.buttonLikedClass)

	var buttonlike = el.querySelector('.' + data.buttonLikeClass)
	// console.log('buttonlike: ', buttonlike)

	var clickend = false;

	function setup() {

		// el.addEventListener('click', function () {

		// 	if(clickend) {
		// 		console.log('dblclick')
		// 		clickend = false

		// 		if (!user) {
		// 			location.href = '/auth/login'
		// 			return
		// 		}

		// 		if(!liked) like()
		// 		else unLike()

		// 	} else {
	
		// 		clickend = true
				
		// 		setTimeout(function () {
		// 			if(clickend){
		// 				console.log('click')
		// 				clickend = false
		// 			}
		// 		}, 400)

		// 	}
		// })

		// if(buttonFeatured)
		// 	buttonFeatured.addEventListener('click', function () {
		// 		console.log()
		// 		if(featureded) unFeatured()
		// 		else featured()
		// 	})

		buttonlike.addEventListener('click', function () {
			console.log('click')

			if (!user) {
				location.href = '/auth/login'
				return
			}

			if(liked) unLike()
			else like()
		})
	}

	function like () {
		console.log('like')
		$.post('/' + user.username + '/work/like/', {idWork: id}, function (data) {
			if (data.status == 200) {
				// buttonliked.classList.remove('hidden')
				// buttonliked.classList.add('active')
				buttonlike.classList.add('active')
				liked = true
				console.log(data)
			}
		})
	}

	function unLike () {
		console.log('unLike')
		$.post('/' + user.username + '/work/unlike/', {idWork: id}, function (data) {
			if (data.status == 200) {
				// buttonliked.classList.add('hidden')
				// buttonliked.classList.remove('active')
				buttonlike.classList.remove('active')
				liked = false
				console.log(data)
			}
		})
	}

	// function featured () {
	// 	$.post('/' + user.username + '/work/featured/', {idWork: id}, function (data) {
	// 		if (data.status == 200) {
	// 			buttonFeatured.classList.remove('disabled')
	// 			featureded = true
	// 		}
	// 	})
	// }

	// function unFeatured () {
	// 	$.post('/' + user.username + '/work/unfeatured/', {idWork: id}, function (data) {
	// 		if (data.status == 200) {
	// 			buttonFeatured.classList.add('disabled')
	// 			featureded = false
	// 		}
	// 	})
	// }

	setup()
}
