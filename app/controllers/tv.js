var basePath = 'tv/';

/**
 * Show the view page for signup
 */
exports.index = function(req, res) {

	global.db.Chapter.findAll().then(function(chapters) {
		return res.render(basePath + 'index', {
			chapters: chapters
		});
	});
};
