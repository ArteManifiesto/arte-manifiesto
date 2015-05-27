
window.section = new Section({
	path: 'products',
	containerClass: 'products',
	templateId: 'template',
	mainFilter: {
		name: 'js-mainFilter',
		url: 'type/'
	},
	parameters: [{
		name: 'js-order',
		url: 'order'
	}, {
		name: 'js-time',
		url: 'time'
	}, {
		name: 'js-price',
		url: 'price'
	}],
	searchers: ['name', 'tag', 'username'],
	createObject: createProductObject
})

function createProductObject(el, model) {
	// new Artist(el, {
	// 	id: model.id,
	// 	followers: model.followers,
	// 	following: model.following,
	// 	buttonFollowClass: 'js-followButton'
	// })
	new Product(el, model)
}


var productEls = document.querySelectorAll('.product')

for (var i = 0; i < productEls.length; i++)
	createProductObject(productEls[i], products[i])


window.collect = new Collect(document.querySelector('.collect'))
