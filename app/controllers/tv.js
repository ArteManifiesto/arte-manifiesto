var basePath = 'tv/';

exports.index = function(req, res) {
	return res.render(basePath + 'index');
};

exports.chapter = function(req, res) {
	global.db.Chapter.findAll().then(function(chapters) {
		return res.render(basePath + 'chapter', {
			chapters: chapters
		});
	});
};