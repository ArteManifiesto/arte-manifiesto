function AddWork (el, data) {
	
	var title = el.querySelector('input[name=title]'),
			description = el.querySelector('textarea[name=description]'),
			categorys = el.querySelectorAll('input[name=category]');
			tags = el.querySelector('textarea[name=tags]');
			publics = el.querySelectorAll('input[name=public]'),
			submit = el.querySelector('.button-solid');

			console.log('submit: ', submit)

	function setup () {
		console.log('setup')
		submit.addEventListener('click', send)
	}

	function send () {
		console.log('submit')
		console.log('title: ', title.value)
		console.log('description: ', description.value)
		// console.log('categorys: ', categorys.value)
		for (var i = categorys.length - 1; i >= 0; i--) {
			if(categorys[i].checked) console.log('category: ', categorys[i].value)
		};
		console.log('tags: ', tags.value)
		// console.log('publics: ', publics.value)
		for (var i = publics.length - 1; i >= 0; i--) {
			if(publics[i].checked) console.log('category: ', publics[i].value)
		};
	}

	setup()
}

window.addWork = new AddWork(document.querySelector('.add-work'), {})