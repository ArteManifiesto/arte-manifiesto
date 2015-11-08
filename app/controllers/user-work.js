var cloudinary = require('cloudinary').v2;
process.env.CLOUDINARY_URL = 'cloudinary://337494525976864:RQ2MXJev18AjVuf-mSNzdmu2Jsc@hackdudes'
cloudinary.config();

var basePath = 'user/work/';

var _ = require('lodash');

exports.index = function (currentPath, req, res) {
    var promises = [
        req.work.save(),
        req.work.userLikes(),
        req.work.more(),
        req.work.similar(req.viewer),
        req.work.getProducts({build: true, viewer: req.viewer, addUser:true}),
        req.work.getTags(),
        req.work.getReviews({include:[global.db.User]})
    ];
    global.db.Sequelize.Promise.all(promises).then(function (result) {
        var query = { where:{id: req.work.id}, include:[global.db.Category],
          viewer: req.viewer, build: true, addUser: true
        }
        global.db.Work.find(query).then(function(work) {
          return res.render(basePath + 'index', {
              entity: 'work',
              owner : req.owner,
              currentPath: currentPath,
              element: work, userLikes: result[1],
              more: result[2], similar: result[3],
              products: result[4],
              tags: result[5],
              reviews: result[6]
          });
        });
    });
};

exports.add = function (req, res) {
  var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";
    global.db.Category.findAll().then(function (categories) {
        return res.render(basePath + 'add-edit', {
        mode:'add',
        categories: categories,
        cloudinary_cors: cloudinary_cors,
        cloudinary: cloudinary
      });
    });
};


/**
 * Work Create
 * ====================================================================
 * When a work is created this is added to the current user and set categories and tags
 * @param categories ids of the cotegories
 * @param tags ids of the tags
 * @param work data
 */
exports.create = function (req, res) {
  var data = JSON.parse(req.body.data);

    var promises = [];
    var tags = data.tags;
    for(var i = 0; i < tags.length ; i++) {
      promises.push(global.db.Tag.findOrCreate({where:{name: tags[i]}}));
    }

    global.db.Sequelize.Promise.all(promises).then(function (results) {
      var tagsResult = [];
      for(var i = 0; i < results.length ; i++)
        tagsResult.push(results[i][0]);
      promises = [
          global.db.Category.findAll({where: {id: {$in: data.categories}}}),
          global.db.Work.create(data),
      ];
      global.db.Sequelize.Promise.all(promises).then(function (data) {
          var categories = data[0], work = data[1];
          var promises = [
              work.setUser(req.user),
              work.setTags(tagsResult),
              work.setCategories(categories)
          ];
          global.db.Sequelize.Promise.all(promises).then(function () {
              if (req.xhr)
                  return res.ok({work: work}, 'Obra creada');

              req.flash('successMessage', 'Obra creada');
              return res.redirect('back');
          });
      });
    });
};

exports.edit = function (req, res) {
  var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";
  var promises = [
    global.db.Category.findAll(),
    req.work.getCategories(),
    req.work.getTags()
  ];
  global.db.Sequelize.Promise.all(promises).then(function (result) {
      return res.render(basePath + 'add-edit', {
        mode:'edit',
        work:req.work,
      categories: result[0],
      workCategories: result[1],
      tags: _.pluck(result[2], 'name'),
      cloudinary_cors: cloudinary_cors,
      cloudinary: cloudinary
    });
  });
};



exports.createReview = function (req, res) {
  req.body.WorkId = parseInt(req.body.idWork,10);
  req.body.UserId = parseInt(req.viewer,10);
  global.db.Review.create(req.body).then(function(review) {
    var query = {where:{id: review.id}, include:[global.db.User]};
    global.db.Review.find(query).then(function(final){
      return res.ok({review: final}, 'Review creado');
    });
  });
};


exports.deleteReview = function (req, res) {
  global.db.Review.findById(req.body.idReview).then(function(review){
    review.destroy().then(function(){
      return res.ok({review: review}, 'Review eliminado');
    });
  });
};

exports.updateReview = function (req, res) {
  global.db.Review.findById(req.body.idReview).then(function(review){
    review.updateAttributes(req.body).then(function(){
      return res.ok({review: review}, 'Review updated');
    });
  });
};

exports.published = function (req, res) {
    var query = {where:{id:req.work.id}, addUser:true};
    global.db.Work.find(query).then(function(work) {
      return res.render(basePath + 'published', {
        work: work
      });
    });
};


exports.sell = function (req, res) {
    var query = {where:{id:req.work.id}, addUser:true, include:[global.db.Tag]};
    global.db.ProductType.findAll().then(function(categories){
      global.db.Work.find(query).then(function(work) {
        return res.render(basePath + 'sell', {
          work: work,
          categories:categories,
          tags: _.pluck(work.Tags, 'name'),
        });
      });
    });
};



exports.update = function (req, res) {
  var data = JSON.parse(req.body.data);
  var promises = [];
  var tags = data.tags;
  for(var i = 0; i < tags.length ; i++) {
    promises.push(global.db.Tag.findOrCreate({where:{name: tags[i]}}));
  }

  global.db.Sequelize.Promise.all(promises).then(function (results) {
    var tagsResult = [];
    for(var i = 0; i < results.length ; i++)
      tagsResult.push(results[i][0]);
    promises = [
        global.db.Category.findAll({where: {id: {$in: data.categories}}}),
        global.db.Work.findById(data.idWork)
    ];
    global.db.Sequelize.Promise.all(promises).then(function (resultPromise) {
        var categories = resultPromise[0] , work = resultPromise[1];
        var promises = [
            work.updateAttributes(data),
            work.setTags(tagsResult),
            work.setCategories(categories)
        ];
        global.db.Sequelize.Promise.all(promises).then(function () {
            if (req.xhr)
                return res.ok({work: work}, 'Obra actualizada');

            req.flash('successMessage', 'Obra actualizada');
            return res.redirect('back');
        });
    });
  });
};

exports.addToCollection = function (req, res) {
    var collections = JSON.parse(req.body.collections);
    var query = {
      viewer: req.viewer,
      collections: collections
    };
    req.work.addToCollection(query).then(function (data) {
        return res.ok({collections: collections}, 'Work has been added to collections');
    });
}

exports.insideCollection = function (req, res) {
  req.work.getCollections({where:{UserId: req.user.id}}).then(function(collections) {
    return res.ok({collections: collections}, 'Collections');
  });
}

exports.delete = function (req, res) {
    req.work.destroy().then(function () {
        if (req.xhr)
            return res.ok({work: req.work}, 'Obra eliminada');

        req.flash('successMessage', 'Obra eliminada');
        return res.redirect('back');
    });
};

exports.like = function (req, res) {
    req.work.like(req.user).then(function (likes) {
        return res.ok({work: req.work, likes: likes}, 'Work liked');
    });
};

exports.unLike = function (req, res) {
    req.work.unLike(req.user).then(function (likes) {
        return res.ok({work: req.work, likes: likes}, 'Work unLiked');
    });
};

exports.featured = function (req, res) {
    req.work.updateAttributes({featured: true}).then(function () {
        return res.ok({work: req.work}, 'Work featured');
    });
};

exports.unFeatured = function (req, res) {
    req.work.updateAttributes({featured: false}).then(function () {
        return res.ok({work: req.work}, 'Work unFeatured');
    });
};

exports.public = function (req, res) {
    req.work.updateAttributes({public: true}).then(function () {
        return res.ok({work: req.work}, 'Work published');
    });
};

exports.private = function (req, res) {
    req.work.updateAttributes({public: false}).then(function () {
        return res.ok({work: req.work}, 'Work unPublished');
    });
};
