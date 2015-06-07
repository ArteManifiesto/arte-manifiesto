var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');


exports.work = function (req, res) {
    return res.json({lel: 10});
};

exports.add = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.upload = function(req,res){
  var cors = "http://" + req.headers.host + "/cloudinary_cors.html";
  // Create a new photo model and set it's default title
  var photo = new Photo();
  Photo.count().then(function(amount){
    photo.title = "My Photo #"+(amount+1)+" (direct)";
  })
  .finally(function(){
    res.render('photos/add_direct', {
      photo:photo,
      cloudinary_cors:cloudinary_cors
    });
  });
}

exports.workCreate = function (req, res) {
    global.getPortfolioCollection(req.user).then(function (collection) {
        var promises = [
            global.db.Category.findAll({where: {id: {in: req.body.categories}}, attributes: ['id']}),
            global.db.Tag.findAll({where: {id: {in: req.body.tags}}, attributes: ['id']}),
            global.db.Work.create(req.body.work)
        ];
        global.db.Sequelize.Promise.all(promises).then(function (data) {
            var categories = data[0], tags = data[1], work = data[2];
            work.url = '/'+ req.user.username + '/work' + work.nameSlugify;
            collection.addWork(work).then(function () {
                var promises = [
                    collection.reorderAfterWorkAdded([work]),
                    work.setUser(req.user),
                    work.setCategories(categories),
                    work.setTags(tags)
                ];

                global.db.Sequelize.Promise.all(promises).then(function () {
                    return res.json(responses.workCreated(work));
                })
            })
        });
    });
};

exports.workDelete = function (req, res) {
    var getWorkQuery = {
        where: {id: req.body.idWork},
        attributes: ['id', 'name'],
        include: [{
            model: global.db.Collection,
            attributes: ['id', 'name'],
            through: {attributes: ['order']}
        }]
    };

    var reorderCollection = function (work, collection) {
        collection.reorderAfterWorkRemoved().then(function () {
            return res.json(responses.workDeleted(work, collection));
        });
    };

    if (!req.body.idCollection) {
        global.getPortfolioCollection(req.user).then(function (collection) {
            getWorkQuery.include[0].where = {id: collection.id, meta: collection.meta};
            global.db.Work.find(getWorkQuery).then(function (work) {
                if (!work)
                    return res.json(responses.workDontExists(req.body.idWork));

                collection = work.Collections[0];
                work.destroy().then(function () {
                    reorderCollection(work, collection);
                });
            });
        });
    } else {
        getWorkQuery.include[0].where = {id: req.body.idCollection, meta: 'work'};
        global.db.Work.find(getWorkQuery).then(function (work) {
            if (!work)
                return res.json(responses.workDontExists(req.body.idWork));

            var collection = work.Collections[0];
            collection.removeWork(work).then(function () {
                reorderCollection(work, collection);
            });
        });
    }
};

exports.workUpdate = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        if (work) {
            var promises = [global.db.Category.findAll()];
            if (req.body.idCollection)
                promises.push(global.db.Collection.find(req.body.idCollection));
            else
                promises.push(global.db.Collection.find(1));
            promises.push(global.db.Tag.findAll());

            global.db.Sequelize.Promise.all(promises).then(function (data) {
                work.updateAttributes(req.body);
                var categories = _.sample(_.shuffle(data[0]), _.random(1, 3));
                var collection = data[1];
                var tags = _.sample(_.shuffle(data[2]), _.random(1, 3));

                if (collection) {
                    promises = [
                        work.save(),
                        work.setCollection(collection),
                        work.setCategories(categories),
                        work.setTags(tags)
                    ];

                    global.db.Sequelize.Promise.all(promises).then(function () {
                        return res.json({
                            code: 202,
                            message: 'Work updated ' + work.name,
                            work: work
                        })
                    });
                } else {
                    return res.json({
                        code: 203,
                        message: "Collection don't exits"
                    })
                }
            });

        } else {
            return res.json({
                code: 203,
                message: "Work don't exits"
            })
        }
    });


    var workPayload = {
        name: chance.name(),
        photo: 'http://i.imgur.com/QPACTzF.png',
        private: _.sample([0, 1])
    };
};

exports.like = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.like().then(function () {
            return res.ok('Work liked');
        });
    })
};

exports.unlike = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.unLiked(req.user).then(function () {
            return res.ok('Work unLiked');
        });
    });
};

exports.featured = function (req, res) {
    console.log('WORK NAME : ' ,req.work.name);
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.featured().then(function () {
            return res.ok('Work featured');
        });
    });
};

exports.unFeatured = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.featured().then(function () {
            return res.ok('Work unFeatured');
        });
    });
};

exports.collections = function(req, res){
}