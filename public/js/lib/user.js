
function User(el, data) {

	var id = data.id,

	followers = data.followers,
	following = data.following,

	buttonFollow = el.querySelector('.button-liner' ),
	followersEl = buttonFollow.querySelector('.button-liner__number');

	function setup() {
		buttonFollow.addEventListener('click', function () {
			console.log('click')
			// if (!user) {
			// 	location.href = '/auth/login'
			// 	return
			// }
			// if (!following) follow()
			// else unFollow()
		})
	}

	function follow() {
		$.post('/' + user.username + '/follow/', {idUser: id}, function (data) {
			// console.log(data)
			if (data.status == 200) {
				following = true
				buttonFollow.classList.add('disabled')
				followers = data.data.followers
				followersEl.innerHTML = followers
			}
		})
	}

	function unFollow() {
		$.post('/' + user.username + '/unfollow/', {idUser: id}, function (data) {
			// console.log(data)
			if (data.status == 200) {
				following = false
				buttonFollow.classList.remove('disabled')
				followers = data.data.followers
				followersEl.innerHTML = followers
			}
		})
	}

	setup()
}