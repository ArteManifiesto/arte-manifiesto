var basePath = 'blog/';

var searchPosts = function (req, addQuery) {
  var query = {
    order: [global.getOrder('newest')]
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

  if (!req.query.idPost)
    return res.render(view, {
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
    });

  var query = {
    where: {
      id: req.query.idPost
    }
  };

  global.db.Post.find(query).then(function (post) {
    post = post.toJSON();

    return res.render(view, {
      post: global._.omit(post, 'body'),
      postBody: post.body,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
    });
  });
};

exports.postPage = function (req, res) {
  global.db.Post.findById(req.params.id).then(function(post) {
    post = post.toJSON();
    return res.render(basePath + 'post', {
      post: global._.omit(post, 'body'),
      postBody: post.body
    });
  });
};

exports.postCreate = function (req, res) {
  global.db.Post.create(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};

exports.postUpdate = function (req, res) {
  req.post.updateAttributes(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};
