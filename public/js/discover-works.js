
new Works()

function makeWorkObject(el, model) {
	// console.log('model: ', model)
	// new Work(el, {
	// 	id: model.id,
	// 	likes: model.lkes,
	// 	liked: model.liked,
	// 	featured: model.featured,
	// 	buttonFeaturedClass: 'button-featured',
	// 	buttonLikedClass: 'button-liked'
	// })

	new Work(el, {
		id: model.id,
		// likes: model.lkes,
		liked: model.liked,
		// featured: model.featured,
		// buttonFeaturedClass: 'button-featured',
		// buttonLikedClass: 'button-liked'
		buttonLikeClass: 'js-likeButton'
	})
}

var workEls = document.querySelectorAll('.work')
// console.log('workEls: ', workEls)

for (var i = 0; i < workEls.length; i++){
	// console.log('works[i]: ', works[i])
	var index = workEls[i].getAttribute('data-index')
	// console.log('index: ', index-1)
	makeWorkObject(workEls[i], works[index-1])
}
