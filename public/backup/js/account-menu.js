
function AccountMenu () {

	var avatar = document.querySelector('.skinny-menu__avatar'),
			menu = document.querySelector('.account-menu'),
			hoverAvatar = false,
			hoverMenu = false;

	function setup () {

		if(!avatar) return

		avatar.addEventListener('mouseover', function () {
			// console.log('avatar mouseover')
			hoverAvatar = true
			menu.classList.add('visible')
		})

		avatar.addEventListener('mouseout', function () {
			// console.log('avatar mouseover')
			hoverAvatar = false

			setTimeout(function () {
				if(!hoverAvatar && !hoverMenu)
					menu.classList.remove('visible')
			}, 100)
		})

		menu.addEventListener('mouseover', function () {
			hoverMenu = true
			// console.log('menu mouseover')
			// menu.style.background = 'red'
		})
		menu.addEventListener('mouseout', function () {
			// console.log('menu mouseout')
			hoverMenu = false

			setTimeout(function () {
				if(!hoverAvatar && !hoverMenu)
					menu.classList.remove('visible')
			}, 100)
		})
	}

	setup()
}

window.accountMenu = new AccountMenu()