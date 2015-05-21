
window.section = new Section({
	path: 'users',
	containerClass: 'users',
	templateId: 'template',
	mainFilter: {
		name: 'js-mainFilter',
		url: 'specialty/'
	},
	parameters: [{
		name: 'js-order',
		url: 'order'
	}, {
		name: 'js-time',
		url: 'time'
	}],
	searchers: ['name', 'tag', 'username'],
	createObject: createUserObject
})

function createUserObject(el, model) {
	// new Artist(el, {
	// 	id: model.id,
	// 	followers: model.followers,
	// 	following: model.following,
	// 	buttonFollowClass: 'js-followButton'
	// })
	new User(el, model)
}


var userEls = document.querySelectorAll('.user')

for (var i = 0; i < userEls.length; i++)
	createUserObject(userEls[i], users[i])
