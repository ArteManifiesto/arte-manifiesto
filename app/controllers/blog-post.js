var basePath = 'blog/';
var moment = require('moment');

/**
 * post view, get reviews, popular posts and increment its popularity
 */
exports.post = function (req, res) {
  var popularPostsQuery = {
    limit: global.limits.singlePost,
    where: {
      published: true,
      id: {$not: [req.post.id]},
      createdAt: {
        $between: [
          moment().startOf('month').toDate(),
          moment().toDate()
        ]
      }
    },
    include: [global.db.Category],
    build: true,
    addUser: true,
    order: [global.getOrder('popularity')]
  };

  req.post.views++;
  var promises = [
    req.post.getCategory(),
    req.post.getReviews({include: [global.db.User]}),
    global.db.Post.findAll(popularPostsQuery),
    req.post.save()
  ];
  global.db.Sequelize.Promise.all(promises).then(function (result) {
    req.post.setDataValue('Category', result[0]);
    var post = req.post.toJSON();
    return res.render(basePath + 'post', {
      post: global._.omit(post, 'body'),
      postBody: post.body,
      reviews: result[1],
      posts: result[2]
    });
  });
};

/**
 * create a new post
 */
exports.create = function (req, res) {
  req.body.UserId = req.user.id;
  req.body.CategoryId = req.body.category;
  global.db.Post.create(req.body).then(function (post) {
    var actionQuery = {
      UserId: req.user.id,
      verb: 'create-post',
      ObjectId: post.id,
      OwnerId: req.user.id
    };
    global.db.Action.create(actionQuery).then(function () {
      return res.ok({post: post}, 'post');
    })
  });
};

/**
 * edit post
 */
exports.edit = function (req, res) {
  var promises = [
    global.db.Category.findAll({where: {meta: 1}}),
    req.post.getCategory()
  ];
  global.db.Sequelize.Promise.all(promises).then(function (result) {
    req.post.setDataValue('Category', result[1]);
    var post = req.post.toJSON();
    return res.render(basePath + 'creator', {
      edit: true,
      post: global._.omit(post, 'body'),
      postBody: post.body,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors,
      categories: result[0]
    });
  });
};

/**
 * update post
 */
exports.update = function (req, res) {
  req.body.CategoryId = req.body.category;
  req.post.updateAttributes(req.body).then(function (post) {
    return res.ok({post: post}, 'post');
  });
};

/**
 * delete post, unfortunately this action makes me cry, don't do it again. okay?
 */
exports.delete = function (req, res) {
  var promises = [
    global.db.Action.destroy({where: {ObjectId: req.post.id}}),
    req.post.destroy()
  ];
  global.db.Sequelize.Promise.all(promises).then(function () {
    return res.ok({post: req.post}, 'Post eliminado');
  });
};

/**
 * create review
 */
exports.review = function (req, res) {
  req.body.PostId = parseInt(req.body.idPost, 10);
  req.body.UserId = parseInt(req.viewer, 10);

  global.db.Review.create(req.body).then(function (review) {
    var query = {where: {id: review.id}, include: [global.db.User]};
    global.db.Review.find(query).then(function (final) {
      return res.ok({review: final}, 'Review creado');
    });
  });
};

/**
 * like post
 */
exports.like = function (req, res) {
  req.post.like(req.user).then(function (likes) {
    var actionQuery = {
      UserId: req.user.id,
      verb: 'like-post',
      ObjectId: req.post.id,
      OwnerId: user.id
    };
    global.db.Action.create(actionQuery).then(function () {
      return res.ok({post: req.post, likes: likes}, 'Post liked');
    });
  });
};

/**
 * featured post, this action is just available to the admin
 */
exports.featured = function (req, res) {
  req.post.updateAttributes({featured: true}).then(function () {
    return res.ok({post: req.post}, 'Post featured');
  });
};

/**
 * unfeature post, this action is just available to the admin
 */
exports.unFeatured = function (req, res) {
  req.post.updateAttributes({featured: false}).then(function () {
    return res.ok({post: req.post}, 'Post unFeatured');
  });
};

/**
 * publish post, this action makes public a post, so everyone can interact with it
 */
exports.publish = function (req, res) {
  req.post.updateAttributes({published: true}).then(function () {
    return res.ok({post: req.post}, 'Post published');
  });
};

/**
 * unpublish post, when a post is unpublished it goes to the draft section
 */
exports.unPublish = function (req, res) {
  req.post.updateAttributes({published: false}).then(function () {
    return res.ok({post: req.post}, 'Post unPublished');
  });
};
