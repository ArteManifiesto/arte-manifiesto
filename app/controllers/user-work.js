var basePath = 'user/work/';

/**
 * get likes, more works from the same author, reviews, tags
 * and neightbors to navigate between others artworks
 */
exports.index = function(currentPath, req, res) {
  req.work.getUser().then(function(user) {
    var promises = [
      req.work.save(),
      req.work.userLikes(),
      req.work.more(),
      req.work.similar(req.viewer),
      req.work.getTags(),
      req.work.getReviews({
        include: [{
          model: global.db.User,
          attributes: {
            exclude: ['email', 'hashedPassword', 'salt', 'tokenVerifyEmail', 'tokenResetPassword', 'tokenResetPasswordExpires']
          }
        }]
      }),
      req.work.neighbors({
        idUser: user.id
      }),
      req.work.getMoreProducts()
    ];
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var query = {
        where: {
          id: req.work.id
        },
        include: [global.db.Category],
        viewer: req.viewer,
        build: true,
        addUser: true
      };
      global.db.Work.find(query).then(function(work) {
        global.db.AdPack.findAll({
          order: [global.db.sequelize.fn('RAND')],
          limit: 1,
          where: {isActive: true},
          include: [{
            model: global.db.Ad,
            include: {
              model: global.db.AdType,
              where: {name: 'vertical'}
            }
          }]
        }).then(function(adPacks) {
          var data = {
            entity: 'work',
            owner: req.owner,
            currentPath: currentPath,
            work: work,
            userLikes: result[1],
            more: result[2],
            similar: result[3],
            tags: result[4],
            reviews: result[5],
            neighbors: result[6],
            categories: result[7],
            lite: (req.query.lite === "1")
          };

          promises = [];
          if(adPacks.length > 0) {
            data.ad = adPacks[0].Ads[0];
            data.ad.views = data.ad.views + 1;
            promises.push(data.ad.save());
          } 
          promises.push(work.view());
          global.db.sequelize.Promise.all(promises).then(function() {
            return res.render(basePath + 'index', data);
          });            
        });
      });
    });
  });
};


/**
 * add work page
 */
exports.add = function(req, res) {
  var query = {
    where: {
      meta: 0
    }
  };
  global.db.Category.findAll(query).then(function(categories) {
    return res.render(basePath + 'add', {
      categories: categories,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    });
  });
};

exports.addProduct = function(req, res) {
  var query = {
    where: {
      meta: 8
    }
  };
  global.db.Category.findAll(query).then(function(categories) {
    return res.render(basePath + 'addProduct', {
      work: req.work,
      categories: categories,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    });
  });
};

/**
 * create work
 * when a work is created this is added to the current user
 * and set categories and tags
 */
exports.create = function(req, res) {
  var promises = [];
  var tags = req.body.tags.split(',');
  if (!req.body.public) req.body.public = false;
  if (!req.body.nswf) req.body.nswf = false;

  for (var i = 0; i < tags.length; i++) {
    var query = {
      where: {
        name: tags[i]
      }
    };
    promises.push(global.db.Tag.findOrCreate(query));
  }

  global.db.Sequelize.Promise.all(promises).then(function(results) {
    var tagsResult = [];
    for (var i = 0; i < results.length; i++)
      tagsResult.push(results[i][0]);
    promises = [
      global.db.Category.findById(req.body.category),
      global.db.Work.create(req.body)
    ];
    global.db.Sequelize.Promise.all(promises).then(function(data) {
      var category = data[0],
        work = data[1];
      var actionQuery = {
        where: {
          UserId: req.user.id,
          verb: 'create-work',
          ObjectId: work.id,
          OwnerId: req.user.id
        }
      };
      var promises = [
        global.db.Action.findOrCreate(actionQuery),
        work.setUser(req.user),
        work.setTags(tagsResult),
        work.setCategory(category),
        req.user.addSpecialties(category)
      ];
      global.db.Sequelize.Promise.all(promises).then(function() {
        return res.ok({
          work: work
        }, 'Obra creada');
      });
    });
  });
};


/**
 * edit work page
 */
exports.edit = function(req, res) {
  var promises = [
    global.db.Category.findAll({
      where: {
        meta: 0
      }
    }),
    req.work.getCategory(),
    req.work.getTags()
  ];
  global.db.Sequelize.Promise.all(promises).then(function(result) {
    return res.render(basePath + 'edit', {
      work: req.work,
      categories: result[0],
      category: result[1],
      tags: global._.pluck(result[2], 'name'),
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    });
  });
};

exports.sell = function(req, res) {
  if (!req.user.isSeller)
    return res.redirect('/user/' + req.user.username + '/account/seller');

  var query = {
    where: {
      meta: 3
    }
  };
  global.db.Category.findAll(query).then(function(categories) {
    var i, category, promises = [];
    for (i = 0; i < categories.length; i++) {
      category = categories[i];
      query = {
        where: {
          ParentCategoryId: category.id
        }
      };
      promises.push(global.db.Category.findAll(query));
    }
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var cats = [];
      for (i = 0; i < categories.length; i++) {
        categories[i].setDataValue('subCategories', result[i]);
        cats.push(categories[i].toJSON());
      }
      return res.render(basePath + 'sell', {
        categories: cats,
        work: req.work,
        cloudinary: global.cl,
        cloudinayCors: global.cl_cors
      });
      return res.json(categories);
    });
  });
};

/**
 * create a review
 */
exports.createReview = function(req, res) {
  req.body.WorkId = parseInt(req.body.idWork, 10);
  req.body.UserId = parseInt(req.viewer, 10);

  global.db.Review.create(req.body).then(function(review) {
    var query = {
      where: {
        id: review.id
      },
      include: [global.db.User]
    };
    var promises = [
      global.db.Review.find(query),
      req.work.getUser()
    ];
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var actionQuery = {
        UserId: req.user.id,
        verb: 'review-work',
        ObjectId: req.work.id,
        OwnerId: result[1].id
      };
      global.db.Action.create(actionQuery).then(function() {
        return res.ok({
          review: result[0]
        }, 'Review creado');
      });
    });
  });
};

/**
 * update a work
 */
exports.update = function(req, res) {
  var promises = [];
  var tags = req.body.tags.split(',');

  if (!req.body.public) req.body.public = false;
  if (!req.body.nsfw) req.body.nsfw = false;

  for (var i = 0; i < tags.length; i++)
    promises.push(global.db.Tag.findOrCreate({
      where: {
        name: tags[i]
      }
    }));

  global.db.Sequelize.Promise.all(promises).then(function(results) {
    var tagsResult = [];
    for (var i = 0; i < results.length; i++)
      tagsResult.push(results[i][0]);

    global.db.Category.findById(req.body.category).then(function(category) {
      var promises = [
        req.work.updateAttributes(req.body),
        req.work.setTags(tagsResult),
        req.work.setCategory(category)
      ];
      global.db.Sequelize.Promise.all(promises).then(function() {
        var query = {
          where: {
            id: req.work.id
          },
          include: [global.db.Category, global.db.Tag]
        };
        global.db.Work.find(query).then(function(work) {
          if (req.xhr)
            return res.ok({
              work: work
            }, 'Obra actualizada');

          req.flash('successMessage', 'Obra actualizada');
          return res.redirect('back');
        });
      });
    });
  });
};

/**
 * remove a work to collections
 */
exports.addToCollection = function(req, res) {
  var collections = JSON.parse(req.body.collections);
  var query = {
    viewer: req.viewer,
    collections: collections
  };
  req.work.addToCollection(query).then(function() {
    return res.ok({
      collections: collections
    }, 'Work added to collections');
  });
};

/**
 * remove a work from the collection
 */
exports.removeFromCollection = function(req, res) {
  var collectionsQuery = {
    where: {
      id: req.body.idCollection
    }
  };
  req.user.getCollections(collectionsQuery).then(function(collections) {
    collections[0].removeWork(req.work).then(function() {
      return res.ok({
        work: req.work
      }, 'Work has been removed from collection');
    });
  });
};

/**
 * check if a work is into a collection
 */
exports.insideCollection = function(req, res) {
  var insideQuery = {
    where: {
      UserId: req.user.id
    }
  };
  req.work.getCollections(insideQuery).then(function(collections) {
    return res.ok({
      collections: collections
    }, 'Collections');
  });
};

/**
 * delete an artwork
 * I would prefer to not implement this feature, but it's my work
 */
exports.delete = function(req, res) {
  req.work.destroy().then(function() {
    var actionQuery = {
      where: {
        ObjectId: req.work.id,
        verb: {
          $in: [
            'like-work', 'request-work',
            'create-work', 'review-work'
          ]
        }
      }
    };
    global.db.Action.destroy(actionQuery).then(function() {
      return res.ok({
        work: req.work
      }, 'Obra eliminada');
    });
  });
};

/**
 * to give a like to an artwork is awesome
 */
exports.like = function(req, res) {
  req.work.getUser().then(function(user) {
    var actionQuery = {
      where: {
        UserId: req.user.id,
        verb: 'like-work',
        ObjectId: req.work.id,
        OwnerId: user.id
      }
    };
    global.db.Action.findOrCreate(actionQuery).then(function() {
      req.work.like(req.user).then(function(likes) {
        return res.ok({
          work: req.work,
          likes: likes
        }, 'Work liked');
      });
    });
  });
};

/**
 * to unlike a work
 * this method is deprecated but you can still check it out
 * to learn how hurt a user :D
 */
exports.unLike = function(req, res) {
  req.work.unLike(req.user).then(function(likes) {
    return res.ok({
      work: req.work,
      likes: likes
    }, 'Work unLiked');
  });
};

/**
 * to feature a user
 * this method will make feel excited to work's author
 */
exports.featured = function(req, res) {
  req.work.updateAttributes({
    featured: true
  }).then(function() {
    return res.ok({
      work: req.work
    }, 'Work featured');
  });
};

/**
 * to unfeature a user
 * this is the way to get killed haha don't unfeature an
 * artwork it hurts to the author
 */
exports.unFeatured = function(req, res) {
  req.work.updateAttributes({
    featured: false
  }).then(function() {
    return res.ok({
      work: req.work
    }, 'Work unFeatured');
  });
};

/**
 * this method executes when a user ask for the work's availability
 * an email arrives to the user when someone asks for their artwork
 * Yep that's such an insane way to sell something in the 21st :P
 */
exports.availability = function(req, res) {
  req.work.getUser().then(function(user) {
    var actionQuery = {
      where: {
        UserId: req.user.id,
        verb: 'request-work',
        ObjectId: req.work.id,
        OwnerId: user.id
      }
    };
    global.db.Action.findOrCreate(actionQuery).then(function() {
      req.work.addWorkRequests(req.user).then(function() {
        var params = {
          to: user,
          requester: req.user,
          work: req.work
        };
        global.emails.availability(req, params).then(function() {
          return res.ok({
            user: req.user
          }, 'asked');
        });
      });
    });
  });
};