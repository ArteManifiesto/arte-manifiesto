
window.section = new Section({
	path: 'products',
	containerClass: 'products',
	templateId: 'template',
	mainFilter: {
		name: 'js-mainFilter',
		url: 'type/'
	},
	parameters: [{
		name: 'js-order',
		url: 'order'
	}, {
		name: 'js-time',
		url: 'time'
	}, {
		name: 'js-price',
		url: 'price'
	}],
	searchers: ['name', 'tag', 'username']
})

