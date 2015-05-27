function Work (el, data) {

	// console.log(el, data)

	var id = data.id,
			// likes = data.likes,
			liked = data.liked,
			singleUrl = data.url
			// featureded = data.featured;
			likeButton = el.querySelector('.social-item');
			// console.log('likeButton: ', likeButton)

	function setup () {
		if(isMobile()){
			// console.log('Mobile Browser')
			var mc = new Hammer.Manager(el);
			mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
			mc.add( new Hammer.Tap({ event: 'singletap' }) );
			mc.get('doubletap').recognizeWith('singletap');
			mc.get('singletap').requireFailure('doubletap');

			mc.on("singletap", function(ev) {
				location.href = singleUrl
			})

			mc.on("doubletap", function(ev) {
				if (!user) {
					location.href = '/auth/login/?returnTo=' + location.href
					return
				}
				if (!liked) like()
				else unLike()
			})

		} else {
			// console.log('Desktop Browser')
			if(!likeButton) return
			likeButton.addEventListener('click', function () {
				if (!user) {
					location.href = '/auth/login/?returnTo=' + location.href
					return
				}
				if (!liked) like()
				else unLike()
			})
		}
	}

	function like () {
		console.log('like')
		$.post('/' + user.username + '/work/like/', {idWork: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				likeButton.classList.add('active')
				liked = true
			}
		})
	}

	function unLike () {
		console.log('unLike')
		$.post('/' + user.username + '/work/unlike/', {idWork: id}, function (data) {
			console.log(data)
			if (data.status == 200) {
				likeButton.classList.remove('active')
				liked = false
			}
		})
	}

	setup()
}

function isMobile() {
	// return true

	if (sessionStorage.desktop) // desktop storage
	return false;
	else if (localStorage.mobile) // mobile storage
	return true;

	// alternative
	var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
	for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

	// nothing found.. assume desktop
	return false;
}
