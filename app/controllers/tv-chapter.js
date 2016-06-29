var basePath = 'tv/';
var moment = require('moment');

exports.chapter = function(req, res) {
  var query = {
    limit: global.limits.singleChapter,
    where: {
      published: true,
      id: {
        $not: [req.chapter.id]
      }
    },
    order: [global.getOrder('newest')]
  };
  var promises = [
    req.chapter.getReviews({
      include: [global.db.User]
    }),
    global.db.Chapter.findAll(query),
    req.chapter.view()
  ];
  global.db.Sequelize.Promise.all(promises).then(function(result) {
    // return res.render(basePath + 'chapter', {
    //   chapter:req.chapter,
    //   reviews:result[0],
    //   latestChapters:result[1]
    // });
    return res.json({
      chapter: req.chapter,
      reviews: result[0],
      latestChapters: result[1]
    });
  });
};

/**
 * create a new post
 */
exports.create = function(req, res) {
  global.db.Chapter.create(req.body).then(function(chapter) {
    return res.ok({
      chapter: chapter
    }, 'chapter created');
  });
};

/**
 * edit post
 */
exports.edit = function(req, res) {
  res.json({
    chapter: req.chapter,
    cloudinary: global.cl,
    cloudinayCors: global.cl_cors
  });
};

/**
 * update post
 */
exports.update = function(req, res) {
  req.chapter.updateAttributes(req.body).then(function(chapter) {
    return res.ok({
      chapter: chapter
    }, 'chapter Updated');
  });
};

/**
 * delete post, unfortunately this action makes me cry, don't do it again. okay?
 */
exports.delete = function(req, res) {
  req.chapter.destroy().then(function() {
    return res.ok({
      chapter: req.chapter
    }, 'chapter destroyed');
  });
};

/**
 * create review
 */
exports.review = function(req, res) {
  req.body.ChapterId = parseInt(req.body.idChapter, 10);
  req.body.UserId = parseInt(req.viewer, 10);

  global.db.Review.create(req.body).then(function(review) {
    var actionQuery = {
      UserId: req.user.id,
      verb: 'review-chapter',
      ObjectId: req.chapter.id,
      OwnerId: req.user.id
    };

    var query = {
      where: {
        id: review.id
      },
      include: [global.db.User]
    };

    var promises = [
      global.db.Review.find(query),
      global.db.Action.create(actionQuery)
    ];

    global.db.Sequelize.Promise.all(promises).then(function(result) {
      return res.ok({
        review: result[0]
      }, 'Review creado');
    });
  });
};

/**
 * publish post, this action makes public a post, so everyone can interact with it
 */
exports.publish = function(req, res) {
  req.chapter.updateAttributes({
    published: true
  }).then(function() {
    return res.ok({
      chapter: req.chapter
    }, 'Chapter published');
  });
};

/**
 * unpublish post, when a post is unpublished it goes to the draft section
 */
exports.unPublish = function(req, res) {
  req.chapter.updateAttributes({
    published: false
  }).then(function() {
    return res.ok({
      chapter: req.chapter
    }, 'Chapter unpublished');
  });
};