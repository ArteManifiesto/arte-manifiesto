
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

	if(isMobile()){

		console.log('Mobile Browser')
		new mobileWork(el, model)

	} else {

		console.log('Desktop Browser')
		new Work(el, model)

	}
}

var workEls = document.querySelectorAll('.work')

for (var i = 0; i < workEls.length; i++){
	var index = workEls[i].getAttribute('data-index')
	createWorkObject(workEls[i], works[index-1])
}

function isMobile() {
	return true

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