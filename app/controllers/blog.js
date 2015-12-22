var basePath = 'blog/';

var searchPosts = function (req) {
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
    console.log(data);
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
    return res.render(view, {
      post: post,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
    });
  });
};

exports.postPage = function (req, res) {
  return res.render(basePath + 'post', {
    post: req.post
  });
};

exports.postCreate = function (req, res) {
  console.log('post create');
  console.log(req.body);
  global.db.Post.create(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};

exports.postUpdate = function (req, res) {
  console.log('post update');
  console.log(req.body);
  req.post.updateAttributes(req.body).then(function(post) {
    return res.ok({post: post}, 'post');
  });
};
