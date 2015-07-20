

function init () {

	var carts = document.querySelectorAll('.cart')

	for (var i = 0; i < carts.length; i++)
		calculateTotals(carts[i])
}


function calculateTotals (el) {

	console.log('el: ', el)

	var items = el.querySelectorAll('.cart-item'),
			total = 0,
			shipping = parseInt(el.getAttribute('data-shipping')),
			subTotalEl = el.querySelector('.js-subTotal');
			totalEl = el.querySelector('.js-total');

	if(items.length == 0) el.remove()

	for (var i = 0; i < items.length; i++) {

		var item = items[i],
				price = parseInt(item.getAttribute('data-price')),
				cant = item.querySelector('input[type=number]').value;

		total += (price * cant)
	}

	subTotalEl.innerHTML = total
	total += shipping
	totalEl.innerHTML = total
}


var inputs = document.querySelectorAll('input[type=number]')

for(var i = 0; i < inputs.length; i++) {
	inputs[i].addEventListener('input', function() {

    var value = parseInt(this.value),
    		cartClass = this.getAttribute('data-cart'),
    		idProduct = this.getAttribute('data-id'),
    		url = '/' + user.username + '/cart/items',
    		data = {
					"idProduct": idProduct,
					"option":1 ,
					"items": value
		    };

    $.post(url, data, function (response) {
    	console.log('response', response)

    	calculateTotals(document.querySelector('.' + cartClass))
    })
	})
}

var closeds = document.querySelectorAll('.js-closed')

for(var i = 0; i < closeds.length; i++) {

	closeds[i].addEventListener('click', function() {

		var item = this.parentElement.parentElement,
				url = '/' + user.username + '/cart/remove',
				idProduct = this.getAttribute('data-id'),
				data = {
					"idProduct": idProduct,
					"option": 1
				};

    $.post(url, data, function (response) {
    	console.log('response', response)

    	if(response.status == 200) {
				var cart = item.parentElement
				item.remove()
				calculateTotals(cart)
    	}
    })
	})
}

init()