
new Artists({
	prefix: 'users',
	makeObject: makeArtistObject
})

function makeArtistObject(el, model) {
	new Artist(el, {
		id: model.id,
		followers: model.followers,
		following: model.following,
		buttonFollowClass: 'js-followButton'
	})
}

var artistEls = document.querySelectorAll('.artist')

for (var i = 0; i < artistEls.length; i++)
	makeArtistObject(artistEls[i], artists[i])
