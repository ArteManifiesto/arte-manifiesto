
window.productsObjects = new Products({
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

window.price = new Price(document.querySelector('.js-price'), {})

function Price (el, data) {
	
	var minValEl = el.querySelector('.js-minPrice'),
			maxValEl = el.querySelector('.js-maxPrice');

	  	minValEl.innerHTML = 0
	  	maxValEl.innerHTML = 3000

	$( "#slider-range" ).slider({
	  range: true,
	  min: 0,
	  max: 3000,
	  values: [ 0, 3000 ],
	  slide: function( event, ui ) {
	  	minValEl.innerHTML = ui.values[0]
	  	maxValEl.innerHTML = ui.values[1]
	  },
	  change: function (event, ui) {
	  	productsObjects.changePrice(ui.values)
	  }
	});

}