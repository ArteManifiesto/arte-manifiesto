function Shipping (el) {

	var addresses = el.querySelectorAll('.address'),
			pos = 0,
			newAddress = el.querySelector('.shipping-form'),
			submit = document.querySelector('.button-solid');

	function setup () {
		console.log('setup!')

		for (var i = 0; i < addresses.length; i++) {
			addresses[i].addEventListener('click', function () {
				var index = parseInt( this.getAttribute('data-pos') )

				addresses[pos].classList.remove('selected')
				addresses[index].classList.add('selected')

				var input = this.querySelector('input')
				input.checked = true

				if(index == addresses.length - 1)
					newAddress.style.display = 'block'
				else
					newAddress.style.display = 'none'

				pos = index
			})
		}

		submit.addEventListener('click', function () {
			if(pos == addresses.length - 1){
				console.log('holi')
				getNewAddress()
			}
			else {
				console.log('pos: ', pos)
			}
		})
	}

	function getNewAddress () {
		console.log('getNewAddress')
	}

	setup()
}

var shipping = new Shipping(document.querySelector('.addresses'))