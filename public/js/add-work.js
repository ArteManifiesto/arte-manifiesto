function AddWork (el, data) {
	
	var title = el.querySelector('input[name=title]'),
			description = el.querySelector('textarea[name=description]'),
			categorys = el.querySelectorAll('input[name=category]');
			tags = el.querySelector('textarea[name=tags]');
			public = el.querySelectorAll('input[name=public]'),
			submit = el.querySelector('.button-solid');

	var errorTitle = el.querySelector('.error-title')
	var errorDescription = el.querySelector('.error-description')
	var errorCategorys = el.querySelector('.error-categorys')
	var errorTags = el.querySelector('.error-tags')
	var errorPublic = el.querySelector('.error-public')

	function setup () {
		submit.addEventListener('click', send)
	}

	function send () {

		var titleVal = title.value,
				descriptionVal = description.value,
				cateorysVal = [],
				tagsVal = tags.value,
				publicVal = null;

		for (var i = categorys.length - 1; i >= 0; i--)
			if(categorys[i].checked) cateorysVal.push(categorys[i].value)

		for (var i = public.length - 1; i >= 0; i--)
			if(public[i].checked)  publicVal = public[i].value

		console.log('titleVal: ', titleVal)
		console.log('descriptionVal: ', descriptionVal)
		console.log('cateorysVal: ', cateorysVal)
		console.log('tagsVal: ', tagsVal)
		console.log('publicVal: ', publicVal)

		var valid = true

		if(!titleVal){
			errorTitle.style.display = 'block'
			valid = false
		}
		else errorTitle.style.display = 'none'

		if(!descriptionVal){
			errorDescription.style.display = 'block'
			valid = false
		}
		else errorDescription.style.display = 'none'

		if(!cateorysVal.length){
			errorCategorys.style.display = 'block'
			valid = false
		}
		else errorCategorys.style.display = 'none'

		if(!tagsVal){
			errorTags.style.display = 'block'
			valid = false
		}
		else errorTags.style.display = 'none'

		if(!publicVal){
			errorPublic.style.display = 'block'
			valid = false
		}
		else errorPublic.style.display = 'none'

		if(valid) console.log('valid')
		else console.log('no valid')
	}

	setup()
}

window.addWork = new AddWork(document.querySelector('.add-work'), {})