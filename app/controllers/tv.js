var basePath = 'tv/';
var moment = require('moment');


var getChapters = function(options) {
  var query = {
    attributes: ['id', 'name', 'nameSlugify', 'video',
      'description', 'releaseDate', 'views'
    ],
    order: [global.getOrder('newest')],
    where: options
  };
  return global.db.Chapter.findAll(query);
}
exports.index = function(req, res) {
  getChapters({
    published: true
  }).then(function(chapters) {
    return res.render(basePath + 'index', {
      chapters: chapters
    });
  });
};

exports.creator = function(req, res) {
  res.render(basePath + 'creator', {
    cloudinary: global.cl,
    cloudinayCors: global.cl_cors
  });
};

exports.draft = function(req, res) {
  getChapters({
    published: false
  }).then(function(drafts) {
    res.render(basePath + 'draft', {
      chapters: drafts
    });
  });
};