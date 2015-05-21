
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
	searchers: ['name', 'tag', 'username']
})