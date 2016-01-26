var basePath = 'blog/';
var moment = require('moment');

exports.postPage = function (req, res) {
  req.post.getCategory().then(function (category) {
    req.post.getReviews({include: [global.db.User]}).then(function(reviews) {
      req.post.setDataValue('Category', category);
      var query = {
        limit: 3,
        where: {
          id: {$not: [req.post.id]},
          createdAt: {
            $between: [moment().startOf('month').toDate(), moment().toDate()]
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

exports.featured = function (req, res) {
    req.post.updateAttributes({featured: true}).then(function () {
        return res.ok({post: req.post}, 'Post featured');
    });
};

exports.unFeatured = function (req, res) {
    req.post.updateAttributes({featured: false}).then(function () {
        return res.ok({post: req.post}, 'Post unFeatured');
    });
};
