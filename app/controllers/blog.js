var basePath = 'blog/';
var moment = require('moment');

var searchPosts = function (req, addQuery) {
  var query = {
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    include: [global.db.Category]
  };

  var page = req.params.page ? req.params.page : 'page-1';
  var options = {
    entity: 'Post',
    limit: global.limits.blog,
    page: page
  };

  return global.getPaginationEntity(options, query);
};

exports.index = function (req, res) {
  searchPosts(req).then(function (data) {
    return res.render(basePath + 'index', {
      data: data
    });
  });
};

exports.posts = function (req, res) {
  searchPosts(req).then(function (data) {
    return res.ok({data: data}, 'Posts listed');
  });
};

exports.creator = function (req, res) {
  var view = basePath + 'creator';

  global.db.Category.findAll({where:{meta: 1}}).then(function(categories) {
    if (!req.query.idPost)
      return res.render(view, {
        cloudinary: global.cl,
        cloudinayCors: global.cl_cors,
        categories: categories
      });

    var query = {
      where: {
        id: req.query.idPost
      },
      include:[global.db.Category]
    };

    global.db.Post.find(query).then(function (post) {
      post = post.toJSON();

      return res.render(view, {
        post: global._.omit(post, 'body'),
        postBody: post.body,
        cloudinary: global.cl,
        cloudinayCors: global.cl_cors,
        categories: categories
      });
    });
  });
};

exports.postPage = function (req, res) {
  var query = {where:{id: req.params.id}, addUser: true, build: true, include:[global.db.Category]};
  global.db.Post.find(query).then(function(post) {
    query = {
      limit: 4,
      where:{
        id: {$not: [post.id]},
        createdAt: {
          $between: [moment().startOf('week').toDate(), moment().toDate()]
        }
      },
      order: [global.getOrder('popularity')]
    };
    global.db.Post.findAll(query).then(function(posts){
      post = post.toJSON();
      return res.render(basePath + 'post', {
        post: global._.omit(post, 'body'),
        postBody: post.body,
        posts: posts
      });
    });
  });
};

exports.postCreate = function (req, res) {
  req.body.UserId = 3;
  req.body.CategoryId = req.body.category;
  global.db.Post.create(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};

exports.postUpdate = function (req, res) {
  req.post.updateAttributes(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};
