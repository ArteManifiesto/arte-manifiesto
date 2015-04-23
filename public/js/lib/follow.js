console.log('holi boli!')

function Follow (container, data) {
	
	console.log('container: ', container)

	var following = data.following || false
	console.log('following: ', following)

	var idUser

	container.addEventListener('click', function () {
		console.log('click')
		idUser = this.getAttribute('data-userId')
		console.log('idUser: ', idUser)

		if(!following){
			follow()
		} else {
			unFollow()
		}
	})

	function follow () {
		console.log('follow')
		
		$.post( '/user/follow/', {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			if (data.code == 202) {
				container.classList.add('disabled')
				following = true
			}
		})
	}

	function unFollow () {
		console.log('unFollow')

		$.post( '/user/unfollow/', {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			if (data.code == 202) {
				container.classList.remove('disabled')
				following = false
			}
		})
	}
}

var buttonsFollow = document.querySelectorAll('.js-followButton')
console.log('buttonsFollow: ', buttonsFollow)

for (var i = 0; i < buttonsFollow.length; i++) {
	
	var state = buttonsFollow[i].getAttribute('data-following')
	// console.log('state: ', state)
	console.log('state == "true": ', (state == "true"))
	
	window.follow = new Follow(buttonsFollow[i], {
		following: (state == "true")
	})
};



