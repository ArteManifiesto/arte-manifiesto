
new Products({
	// prefix: 'users',
	makeObject: makeProductObject
})

function makeProductObject(el, model) {

	new Product(el, {
		id: model.id,
		likes: model.likes,
		liked: model.liked,
		buttonLikeClass: 'button-like'
	})
}

var productEls = document.querySelectorAll('.product')

for (var i = 0; i < productEls.length; i++)
	makeProductObject(productEls[i], products[i])
