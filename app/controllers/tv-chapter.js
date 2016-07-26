var basePath = 'tv/';
var moment = require('moment');

exports.chapter = function(req, res) {
  var promises = [
    req.chapter.getReviews({
      order: [global.getOrder('newest')],
      include: [global.db.User]
    }),
    req.chapter.view()
  ];
  global.db.Sequelize.Promise.all(promises).then(function(result) {
    var chapter = req.chapter.toJSON();

    return res.render(basePath + 'chapter', {
      chapter: global._.omit(chapter, 'body'),
      chapterBody: chapter.body,
      reviews: result[0]
    });
  });
};

/**
 * create a new post
 */
exports.create = function(req, res) {
  req.body.releaseDate = moment(req.body.releaseDate, 'DD/MM/YYYY');

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
  var chapter = req.chapter.toJSON();
  return res.render(basePath + 'creator', {
    edit: true,
    chapter: global._.omit(chapter, 'body'),
    chapterBody: chapter.body,
    cloudinary: global.cl,
    cloudinayCors: global.cl_cors
  });
};

/**
 * update post
 */
exports.update = function(req, res) {
  req.body.releaseDate = moment(req.body.releaseDate, 'DD/MM/YYYY')
  req.chapter.updateAttributes(req.body).then(function(chapter) {
    return res.ok({
      chapter: chapter
    }, 'chapter updated');
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

exports.addCompetitor = function(req, res) {
  req.chapter.addUserContestsTv(req.user).then(function(userContestTV) {
    return res.json(userContestTV);
  });
};