
window.section = new Section({
	path: 'works',
	containerClass: 'works',
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
	createObject: createWorkObject
})

function createWorkObject(el, model) {
	new Work(el, model)
}

var workEls = document.querySelectorAll('.work')

for (var i = 0; i < workEls.length; i++){
	var index = workEls[i].getAttribute('data-index')
	createWorkObject(workEls[i], works[index-1])
}