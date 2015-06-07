
function makeEl (template, data) {
	var elString = template(data)
	var div = document.createElement('div')
	div.innerHTML = elString
	return div.children[0]
}
