var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

exports.profile = function (req, res) {
    var showProfile = function (user, owner) {
        var promises = [
            user.getFollowings(),
            user.getFollowers(),
            user.getCollections({
                order: [[global.db.Work, 'order']],
                include: [{
                    model: global.db.Work,
                    include: [global.db.Category, global.db.Tag]
                }]
            }),
            user.getLikes()
        ];
        global.db.Sequelize.Promise.all(promises).then(function (data) {
            var followings = data[0], followers = data[1], collections = data[2], likes = data[3];

            var view = owner ? 'owner' : 'profile';

            var dataToView = {
                followings: followings,
                followers: followers,
                collections: collections,
                likes: likes
            };

            if (!owner)
                dataToView.userProfile = user;
            return res.render(basePath + view, dataToView);
        });
    };

    if (req.user.username == req.params.username) {
        showProfile(req.user, true);
    } else {
        global.db.User.find({where: {username: req.params.username}}).then(function (user) {
            if (user) {
                showProfile(user, false);
            } else {
                return res.redirect('back');
            }
        });
    }
};


exports.update = function (req, res) {
    var specialtiesData = JSON.parse(req.body.specialties);
    var interestsData = JSON.parse(req.body.interests);

    delete req.body.specialties;
    delete req.body.interests;

    var promises = [
        global.db.Category.findAll({where: {id: {in: specialtiesData}}}),
        global.db.Category.findAll({where: {id: {in: interestsData}}})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (result) {
        var specialties = result[0], interests = result[1];
        promises = [
            req.user.updateAttributes(req.body),
            req.user.setSpecialties(specialties),
            req.user.setInterests(interests)
        ];

        global.db.Sequelize.Promise.all(promises).then(function () {
            return res.json({
                code: 203,
                message: 'User updated'
            });
        });
    });
};

exports.configuration = function (req, res) {
    var promises = [
        global.db.Category.findAll(),
        req.user.getSpecialties(),
        req.user.getInterests()
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = data[0], specialties = data[1], interests = data[2];

        return res.render(basePath + 'configuration', {
            categories: categories,
            specialties: specialties,
            interests: interests
        });
    });
};

exports.follow = function (req, res) {
    console.log("follow id : ", req.body.idUser);
    global.db.User.find(req.body.idUser).then(function (user) {
        req.user.addFollowing(user).then(function () {
            return res.json({
                code: 202,
                message: 'follow to ' + user.firstname
            });
        });
    })
};

exports.unfollow = function (req, res) {
    console.log("unfollow id : ", req.body.idUser);
    global.db.User.find(req.body.idUser).then(function (user) {
        req.user.removeFollowing(user).then(function () {
            return res.json({
                code: 202,
                message: 'unfollow to ' + user.firstname
            });
        });
    })
};

exports.workCreateView = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.workCreate = function (req, res) {
    var promises = [global.db.Category.findAll()];
    if (req.body.idCollection)
        promises.push(global.db.Collection.find(req.body.idCollection));
    else
        promises.push(global.db.Collection.find(1));

    var workPayload = {
        name: chance.name(),
        photo: 'http://i.imgur.com/QPACTzF.png',
        private: _.sample([0, 1])
    };
    promises.push(global.db.Work.create(workPayload));
    promises.push(global.db.Tag.findAll());
    promises.push(req.user.getCollections());

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var categories = _.sample(_.shuffle(data[0]), _.random(1, 3));
        var collection = data[1];
        var work = data[2];
        var tags = _.sample(_.shuffle(data[3]), _.random(1, 3));
        collection.getWorks({attributes: ['order'], order: '`order` DESC', limit: 1}).then(function (works) {
            var maxOrder = 0;
            if (works.length > 0)
                maxOrder = works[0].order;
            work.order = maxOrder + 1;
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
                        message: 'Work created ' + work.name,
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
    });
};

exports.workRemove = function (req, res) {
    global.db.Collection.find(req.body.idCollection).then(function (collection) {
        if (collection) {
            collection.getWorks({where: {id: req.body.idWork}, limit: 1}).then(function (works) {
                var work = works[0];
                if (work) {
                    collection.getWorks({where: {order: {gte: work.order}}}).then(function (works) {
                        var i, workToUpdate, promises = [work.destroy()];
                        for (i = 0; i < works.length; i++) {
                            workToUpdate = works[i];
                            workToUpdate.order = work.order;
                            work.order += i;
                            promises.push(workToUpdate.save());
                        }
                        global.db.Sequelize.Promise.all(promises).then(function () {
                            return res.json({
                                code: 202,
                                message: 'Work deleted ' + work.name
                            })
                        });
                    });
                } else {
                    return res.json({
                        code: 203,
                        message: "Work don't exits"
                    })
                }
            });
        } else {
            return res.json({
                code: 203,
                message: "Collection don't exits"
            })
        }
        /*global.db.Work.find(req.body.idWork).then(function (work) {
         if (work) {
         work.destroy().then(function () {
         return res.json({
         code: 202,
         message: 'Work deleted ' + work.name
         })
         })
         } else {

         }
         });*/
    });
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
    console.log("like id : ", req.body.idWork);

    global.db.Work.find(req.body.idWork).then(function (work) {
        req.user.addLike(work).then(function () {
            return res.json({
                code: 202,
                message: 'like to ' + work.name
            });
        });
    })
};

exports.unlike = function (req, res) {
    console.log("unlike id : ", req.body.idWork);
    global.db.Work.find(req.body.idWork).then(function (work) {
        req.user.removeLike(work).then(function () {
            return res.json({
                code: 202,
                message: 'unlike to ' + work.name
            });
        });
    })
};

exports.collectionCreate = function (req, res) {
    global.db.Collection.create(req.body).then(function (collection) {
        req.user.addCollection(collection).then(function () {
            return res.json({
                code: 202,
                message: 'Collection created ' + collection.name,
                collection: collection
            })
        })
    });
};

exports.collectionUpdate = function (req, res) {
    global.db.Collection.find(req.body.idCollection).then(function (collection) {
        if (collection) {
            collection.name = req.body.name;
            collection.save().then(function () {
                req.user.addCollection(collection).then(function () {
                    return res.json({
                        code: 202,
                        message: 'Collection updated ' + collection.name,
                        collection: collection
                    })
                })
            });
        } else {
            return res.json({
                code: 203,
                message: "Collection don't exits"
            })
        }
    });
};

exports.collectionRemove = function (req, res) {
    global.db.Collection.find(req.body.idCollection).then(function (collection) {
        if (collection) {
            if (collection.name == 'Wish list' || collection.name == 'General')
                return res.json({
                    code: 203,
                    message: 'The ' + collection.name + ' collection is unable to deleted'
                });

            collection.destroy().then(function () {
                return res.json({
                    code: 202,
                    message: 'Collection delete ' + collection.name,
                    collection: collection
                })
            });
            //TODO when delete the collection pass works to general collection
            /*
             collection.getWorks().then(function (works) {
             req.user.getCollections({where: {name: 'General'}}).then(function (generalCollections) {
             var generalCollection = generalCollections[0];
             generalCollection.getWorks({
             attributes: ['order'],
             order: '`order` DESC',
             limit: 1
             }).then(function (generalCollectionWorks) {
             var maxOrder = generalCollectionWorks[0].order;
             var i, work, promises = [];
             for (i = 0; i < works.length; i++) {
             work = works[i];
             work.order = ++maxOrder;
             promises.push(work.save())
             }
             global.db.Sequelize.Promise.all(promises).then(function (works) {
             generalCollection.addWorks(works).then(function () {
             collection.destroy().then(function () {
             return res.json({
             code: 202,
             message: 'Collection delete ' + collection.name,
             collection: collection
             })
             });
             });
             });
             });
             });
             });*/
        } else {
            return res.json({
                code: 203,
                message: "Collection don't exits"
            })
        }
    });
};

exports.collectionReOrder = function (req, res) {
    var worksOrder = req.body.worksOrder;
    global.db.Collection.find(req.body.idCollection).then(function (collection) {
        collection.getWorks().then(function (works) {
            var i, j, workOrder, promises = [];
            var changeOrder = function (work) {
                for (j = 0; j < worksOrder.length; j++) {
                    workOrder = worksOrder[i];
                    if (work.id == workOrder.id) {
                        work.order = workOrder.order;
                        return work.save();
                    }
                }
            };

            for (i = 0; i < works.length; i++)
                promises.push(changeOrder(works[i]));

            global.db.Sequelize.Promise.all(promises).then(function () {
                return res.json({
                    code: 202,
                    message: 'Collection ReOrder'
                })
            });
        });
    });
};