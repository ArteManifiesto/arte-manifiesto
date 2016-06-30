var basePath = 'tv/';
var moment = require('moment');


var getChapters = function(options) {
  var query = {
    order: [global.getOrder('newest')],
    where: options
  };
  return global.db.Chapter.findAll(query);
}
exports.index = function(req, res) {
  getChapters({
    published: true
  }).then(function(chapters) {
    var query = {
      where: {
        username: 'artemanifiesto'
      }
    };
    global.db.User.find(query).then(function(amUser) {
      return res.render(basePath + 'index', {
        chapters: chapters,
        amUser: amUser
      });
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
  }).then(function(chapters) {
    var query = {
      where: {
        username: 'artemanifiesto'
      }
    };
    global.db.User.find(query).then(function(amUser) {
      return res.render(basePath + 'draft', {
        chapters: chapters,
        amUser: amUser
      });
    });
  });
};