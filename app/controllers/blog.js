var basePath = 'blog/';
var moment = require('moment');

var searchPosts = function (req, options) {
  options = options || {entity: 'Post'}
  var query = {
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    where: {featured: false},
    include: [global.db.Category]
  };

  var page = req.params.page ? req.params.page : 'page-1';
  options.limit = 20;
  options.page = page;

  return global.getPaginationEntity(options, query);
};

exports.index = function (req, res) {

  global.db.Post.findAll({
    where: {featured: true},
    order: [global.getOrder('newest')],
    addUser: true,
    build: true,
    include: [global.db.Category]
  }).then(function (featureds) {
    for (var i = 0; i < featureds.length; i++) {
      featureds[i] = featureds[i].toJSON();
    }
    global.db.Category.findAll({where: {meta: 1}}).then(function (categories) {
      searchPosts(req).then(function (data) {
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
    //
    //   if (!req.query.idPost) {
    //     console.log('we are passing by');
    //       return res.render(view, {
    //         cloudinary: global.cl,
    //         cloudinayCors: global.cl_cors,
    //         categories: categories
    //       });
    //   }
    //
    //   var query = {
    //     where: {
    //       id: req.query.idPost
    //     },
    //     include: [global.db.Category]
    //   };
    //
    //   global.db.Post.find(query).then(function (post) {
    //     post = post.toJSON();
    //
    //     return res.render(view, {
    //       post: global._.omit(post, 'body'),
    //       postBody: post.body,
    //       cloudinary: global.cl,
    //       cloudinayCors: global.cl_cors,
    //       categories: categories
    //     });
    //   });
  });
};

exports.postPage = function (req, res) {
  req.post.getCategory().then(function (category) {
    req.post.getReviews({include: [global.db.User]}).then(function(reviews) {
      req.post.setDataValue('Category', category);
      var query = {
        limit: 3,
        where: {
          id: {$not: [req.post.id]},
          createdAt: {
            $between: [moment().startOf('week').toDate(), moment().toDate()]
          }
        },
        include: [global.db.Category],
        build: true,
        addUser: true,
        order: [global.getOrder('popularity')]
      };
      global.db.Post.findAll(query).then(function (posts) {
        post = req.post.toJSON();
        return res.render(basePath + 'post', {
          post: global._.omit(post, 'body'),
          postBody: post.body,
          posts: posts,
          reviews: reviews
        });
      });
    });
  });
};

exports.postCreate = function (req, res) {
  req.body.UserId = req.user.id;
  req.body.CategoryId = req.body.category;
  global.db.Post.create(req.body).then(function (post) {
    return res.ok({post: post}, 'post');
  });
};

exports.postUpdate = function (req, res) {
  req.body.CategoryId = req.body.category;
  req.post.updateAttributes(req.body).then(function (post) {
    return res.ok({post: post}, 'post');
  });
};

exports.createReview = function (req, res) {
  console.log(req.body.idPost);
  req.body.PostId = parseInt(req.body.idPost,10);
  req.body.UserId = parseInt(req.viewer, 10);

  global.db.Review.create(req.body).then(function(review) {
    var query = {where:{id: review.id}, include:[global.db.User]};
    global.db.Review.find(query).then(function(final) {
      return res.ok({review: final}, 'Review creado');
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

exports.like = function(req, res) {
  req.post.like(req.user).then(function (likes) {
    return res.ok({post: req.post, likes: likes}, 'Post liked');
  });
};

exports.editPage = function(req, res) {
  var view = basePath + 'creator';
  global.db.Category.findAll({where: {meta: 1}}).then(function (categories) {
    req.post.getCategory().then(function (category) {
      req.post.setDataValue('Category', category);
        var post = req.post;
        post = post.toJSON();
        return res.render(view, {
          edit: true,
          post: global._.omit(post, 'body'),
          postBody: post.body,
          cloudinary: global.cl,
          cloudinayCors: global.cl_cors,
          categories: categories
        });
    });
  });
};
