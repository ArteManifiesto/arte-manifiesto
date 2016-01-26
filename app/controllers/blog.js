var basePath = 'blog/';
var moment = require('moment');

var searchPosts = function (req, options, ids) {
  options = options || {entity: 'Post'}
  var query = {
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    where: {id:{ $not: [ids]}},
    include: [global.db.Category]
  };

  var page = req.params.page ? req.params.page : 'page-1';
  options.limit = 10;
  options.page = page;

  return global.getPaginationEntity(options, query);
};

exports.index = function (req, res) {
  global.db.Post.findAll({
    where: {featured: true},
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    limit: 3,
    include: [global.db.Category]
  }).then(function (featureds) {
    var ids = [0];
    for (var i = 0; i < featureds.length; i++) {
      featureds[i] = featureds[i].toJSON();
      ids.push(featureds[i].id);
    }

    global.db.Category.findAll({where: {meta: 1}}).then(function (categories) {
      searchPosts(req, null, ids).then(function (data) {
        return res.render(basePath + 'index', {
          data: data,
          featureds: featureds,
          categories: categories
        });
      });
    });
  });
};

exports.posts = function (req, res) {
  searchPosts(req).then(function (data) {
    return res.json(data);
  });
};

exports.creator = function (req, res) {
  var view = basePath + 'creator';

  global.db.Category.findAll({where: {meta: 1}}).then(function (categories) {
    return res.render(view, {
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
      categories: categories
    });
  });
};


exports.categoryPosts = function (req, res) {
  var query = {
    where: {
      nameSlugify: req.params.category
    }
  };
  global.db.Category.find(query).then(function (category) {
    global.db.Category.findAll({where: {meta: 1}}).then(function (categories) {
      if (category) {
          searchPosts(req, {entity: category, method:'getPosts',tempEntity:'Post', association: true}).then(function(posts) {
            res.render(basePath + 'category', {
              category: category,
              categories: categories,
              posts:posts
            });
          });
      }
    });
  });
};
