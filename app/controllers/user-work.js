var cloudinary = require('cloudinary').v2;
process.env.CLOUDINARY_URL = 'cloudinary://337494525976864:RQ2MXJev18AjVuf-mSNzdmu2Jsc@hackdudes'
cloudinary.config();

var basePath = 'user/work/';

exports.index = function (currentPath, req, res) {
    var promises = [
        req.work.save(),
        req.work.userLikes(),
        req.work.more(),
        req.work.similar(req.viewer),
        req.work.getProducts({build: true, viewer: req.viewer, addUser:true})
    ];
    global.db.Sequelize.Promise.all(promises).then(function (result) {
        var query = { where:{id: req.work.id}, include:[global.db.Category],
          viewer: req.viewer, build: true, addUser: true
        }
        global.db.Work.find(query).then(function(work) {
          return res.render(basePath + 'index', {
              currentPath: currentPath,
              work: work, userLikes: result[1],
              more: result[2], similar: result[3],
              products: result[4]
          });
        });
    });
};

exports.add = function (req, res) {
  var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";

    global.db.Category.findAll().then(function (categories) {
        return res.render(basePath + 'add', {categories: categories,
        cloudinary_cors: cloudinary_cors,
        cloudinary: cloudinary});
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
    var promises = [
        global.db.Category.findAll({where: {id: {$in: data.categories}}}),
        global.db.Work.create(data, {user: req.user})
    ];
    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = data[0], work = data[1];
        var promises = [
            work.setUser(req.user),
            work.setCategories(categories)
        ];
        global.db.Sequelize.Promise.all(promises).then(function () {
            if (req.xhr)
                return res.ok({work: work}, 'Obra creada');

            req.flash('successMessage', 'Obra creada');
            return res.redirect('back');
        });
    });
};

exports.edit = function (req, res) {
    return res.render(basePath + 'edit');
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
    var query = {where:{id:req.work.id}, addUser:true};
    global.db.Work.find(query).then(function(work) {
      return res.render(basePath + 'sell', {
        work: work
      });
    });
};



exports.update = function (req, res) {
    var promises = [
        global.db.Category.findAll({where: {id: {$in: req.body.categories}}}),
        global.db.Tag.findAll({where: {id: {$in: req.body.tags}}})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = data[0], tags = data[1],
            promises = [
                req.work.updateAttributes(req.body),
                req.work.setCategories(categories),
                req.work.setTags(tags)
            ];
        global.db.Sequelize.Promise.all(promises).then(function () {
            if (req.xhr)
                return res.ok({work: req.work}, 'Obra actualizada');

            req.flash('successMessage', 'Obra actualizada');
            return res.redirect('back');
        });
    });
};


exports.addToCollection = function (req, res) {
    var collections = req.body.collections;
    var query = {
      viewer: req.viewer,
      collections: collections
    };
    req.work.addToCollection(query).then(function (data) {
        return res.ok({collections: collections}, 'Work has been added to collections');
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
