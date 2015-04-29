
new Works()

function makeWorkObject(el, model) {
	// console.log('model: ', model)
	new Work(el, {
		id: model.id,
		likes: model.lkes,
		liked: model.liked,
		featured: model.featured,
		buttonFeaturedClass: 'button-featured',
		buttonLikedClass: 'button-liked'
	})
}

var workEls = document.querySelectorAll('.work')
// console.log('workEls: ', workEls)

for (var i = 0; i < workEls.length; i++){
	// console.log('works[i]: ', works[i])
	makeWorkObject(workEls[i], works[i])
}
