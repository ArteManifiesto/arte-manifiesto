	function Artist(el, data) {

	var id = data.id,

	followers = data.followers,
	following = data.following,

	buttonFollow = el.querySelector('.' + data.buttonFollowClass),
	followersEl = buttonFollow.querySelector('.button-liner__number');

	followersEl.innerHTML = followers


	function setup() {
		buttonFollow.addEventListener('click', function () {
			if (!following) follow()
			else unFollow()
		})
	}

	function follow() {
		$.post('/' + user.username + '/follow/', {idUser: id}, function (data) {
			console.log(data)
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
			console.log(data)
			if (data.status == 200) {
				buttonFollow.classList.remove('disabled')
				following = false
				followers = data.data.followers
				followersEl.innerHTML = followers
			}
		})
	}

	setup()
	}