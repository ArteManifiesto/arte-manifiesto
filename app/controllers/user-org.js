var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');
exports.profile = function (req, res) {
    var optionsFollowers = {
        viewer: undefined,
        user: req.profile.id,
        page: undefined,
        limit: undefined,
        type: 'followers'
    };
    var countFollowersQuery = global.queries['followers'](optionsFollowers, true);

    var optionsFollowings = {
        viewer: undefined,
        user: req.profile.id,
        page: undefined,
        limit: undefined,
        type: 'followings'
    };
    var countFollowingsQuery = global.queries['followers'](optionsFollowings, true);

    var promises = [
        global.db.sequelize.query(countFollowersQuery, {nest: true, raw: true}),
        global.db.sequelize.query(countFollowingsQuery, {nest: true, raw: true})
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        return res.json(data);
    })
};

var getPaginationData = function (nameQuery, options, record) {
    var tempPagination = global.getPagination(options.page, options.limit);

    options.offset = tempPagination.offset;
    options.limit = tempPagination.limit;

    var recordsQuery = global.queries[nameQuery](options);
    var countQuery = global.queries[nameQuery](options, true);

    var promises = [
        global.db.sequelize.query(recordsQuery, {nest: true, raw: true}),
        global.db.sequelize.query(countQuery, {nest: true, raw: true})
    ];

    return global.db.Sequelize.Promise.all(promises).then(function (data) {
        var records = data[0], total = data[1][0].total;
        var pagination = {
            total: total,
            page: tempPagination.page,
            limit: tempPagination.limit,
            pages: Math.ceil(total / tempPagination.limit)
        };
        return {records: records, pagination: pagination};
    });
};

exports.portfolio = function (req, res) {
    global.getPortfolioCollection(req.profile).then(function (collection) {
        var options = {collection: collection.id, page: req.params.page, limit: 10};
        getPaginationData('getWorksOfPortfolio', options).then(function (data) {
            return res.json(data);
        });
    });
};

exports.likes = function (req, res) {
    req.profile.getLikes({offset: 1, limit: 2, where: {public: true}}).then(function (likes) {
        return res.json(likes);
    });
};


exports.store = function (req, res) {
    global.getStoreCollection(req.profile).then(function (collection) {
        var options = {collection: collection.id, page: req.params.page, limit: 10};
        getPaginationData('getProductsOfStore', options).then(function (data) {
            return res.json(data);
        });
    });
};

exports.collectionsWorks = function (req, res) {
    var options = {user: req.profile.id, meta: 'work', page: req.params.page, limit: 1};
    getPaginationData('getCollectionsByMeta', options).then(function (data) {
        return res.json(data);
    });
};

exports.collectionsProducts = function (req, res) {
    var options = {user: req.profile.id, meta: 'product', page: req.params.page, limit: 1};
    getPaginationData('getCollectionsByMeta', options).then(function (data) {
        return res.json(data);
    });
};

exports.followers = function (req, res) {
    var options = {viewer: req.viewer, user: req.profile.id, page: req.params.page, limit: 10, type: 'followers'};
    getPaginationData('followers', options).then(function (data) {
        var records = global.mergeEntity(data.records, ['Works']);
        _.map(records, function (value, key) {
            value['Works'] = _.slice(value['Works'], 0, 6);
        });
        return res.json({followers: records, pagination: data.pagination});
    });
};

exports.followings = function (req, res) {
    var options = {viewer: req.viewer, user: req.profile.id, page: req.params.page, limit: 10, type: 'followings'};
    getPaginationData('followers', options).then(function (data) {
        var records = global.mergeEntity(data.records, ['Works']);
        _.map(records, function (value, key) {
            value['Works'] = _.slice(value['Works'], 0, 6);
        });
        return res.json({followings: records, pagination: data.pagination});
    });
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
        user.addFollower(req.user).then(function () {
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
        user.removeFollower(req.user).then(function () {
            return res.json({
                code: 202,
                message: 'unfollow to ' + user.firstname
            });
        });
    })
};

exports.work = function (req, res) {
    var getWorkQuery = {
        where: {nameSlugify: req.params.nameWork},
        include: [
            {
                model: global.db.User,
                attributes: ['id'],
                include: [
                    {model: global.db.User, as: 'Followers', attributes: [], through: {attributes: []}}
                ]
            },
            {model: global.db.User, as: 'Collects'}
        ]
    };
    global.db.Work.find(getWorkQuery).then(function (work) {
        var query = {
            where: {id: work.User.id},
            attributes: [],
            include: [
                {
                    model: global.db.Work,
                    where: {id: {not: [work.id]}}
                }
            ]
        };
        global.db.User.find(query).then(function (otherWorks) {
            if (req.user) {
                req.user.getInterests().then(function (interests) {
                    var ids = [0].concat(_.pluck(interests, 'id'));

                    var que = {
                        where: {id: {in: ids}},
                        include: [global.db.Work]
                    };
                    global.db.Category.findAll(que).then(function (worksforme) {
                        return res.json(worksforme);
                    });
                });
            } else {
                return res.json({
                    work: work,
                    otherWorks: otherWorks
                });
            }
        });

        /*
         return res.render('user/work', {
         work: work
         })
         */
    });
};

exports.workCreateView = function (req, res) {
    return res.render(basePath + 'work-create');
};

/**
 * Work Create
 * ====================================================================
 * When a work is created this is added to a portfolio collection
 * too the work is reordered automatically in the collection
 * finally the work is added to the current user and set
 * the categories and tags
 * @param categories ids of the cotegories
 * @param tags ids of the tags
 * @param work data
 */
exports.workCreate = function (req, res) {
    global.getPortfolioCollection(req.user).then(function (collection) {
        var promises = [
            global.db.Category.findAll({where: {id: {in: req.body.categories}}, attributes: ['id']}),
            global.db.Tag.findAll({where: {id: {in: req.body.tags}}, attributes: ['id']}),
            global.db.Work.create(req.body.work)
        ];

        global.db.Sequelize.Promise.all(promises).then(function (data) {
            var categories = data[0], tags = data[1], work = data[2];

            collection.addWork(work).then(function () {
                var promises = [
                    collection.reorderAfterWorkAdded([work]),
                    work.setUser(req.user),
                    work.setCategories(categories),
                    work.setTags(tags)
                ];

                global.db.Sequelize.Promise.all(promises).then(function () {
                    return res.ok('work created');
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

    /*
     global.db.Work.find(getWorkQuery).then(function (work) {
     var collection = work.Collections[0];
     collection.removeWork(work).then(function () {
     reorderCollection(collection);
     });
     });

     if (req.body.idCollection) {
     getWorkQuery.include[0].where.id =;

     } else {
     global.getPortfolioCollection(req.user).then(function (collection) {
     getWorkQuery.include[0].where.id = collection.id;

     global.db.Work.find(getWorkQuery).then(function (work) {
     if (!work)

     collection = work.Collections[0];
     work.destroy().then(function () {
     reorderCollection(collection);
     });
     });
     });
     }

     global.db.Work.find(req.body.idWork).then(function (work) {
     if (!work)
     return res.json(responses.workDontExists(req.body.idWork));

     var reorderCollection = function (collection) {
     collection.reorderAfterWorkRemoved(work).then(function () {
     return res.json(responses.workDeleted(work));
     });
     };

     if (work.UserId != req.user.id) {
     global.db.Work.find(getCollectionOfWork).then(function (work) {
     var collection = work.Collections[0];
     collection.removeWork(work).then(function () {
     reorderCollection(collection);
     });
     });
     } else {
     global.getPortfolioCollection(req.user).then(function (collection) {
     work.destroy().then(function () {
     reorderCollection(collection);
     });
     });
     }
     });
     */
    /*
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
     });*/
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
        work.addLike(req.user).then(function () {
            return res.json({
                code: 202,
                message: 'like to ' + work.name
            });
        });
    })
};

exports.unlike = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        req.user.removeLike(work).then(function () {
            return res.json({
                code: 202,
                message: 'unlike to ' + work.name
            });
        });
    });
};


/**
 * Collection create
 * ====================================================================
 * create a collection passing data for that
 * @param * all paramaters for creation
 */
exports.create = function (req, res) {
    if (['work', 'product'].indexOf(req.body.meta) == -1)
        return res.json(responses.collectionCannotCreate(req.body.meta));

    global.db.Collection.create(req.body).then(function (collection) {
        req.user.addCollection(collection).then(function () {
            return res.json(responses.collectionCreated(collection));
        })
    });
};

/**
 * Collection read
 * ====================================================================
 * read a collection from the current user
 * @param idCollection
 */
exports.index = function (req, res) {
    req.collection.getProducts().then(function (products) {
        return res.json({collection: req.collection, products: products});
    });
};

/**
 * Collection update
 * ====================================================================
 * pass all parameters that need update
 * @param idCollection the collection that will update
 * @param * all parameters for update
 */
exports.update = function (req, res) {
    req.collection.updateAttributes(req.body).then(function () {
        return res.json(responses.collectionUpdated(collection));
    });
};

/**
 * Collection remove
 * ====================================================================
 * if collection not have works is deleted instantly
 * if collection have works , the user can pass to another collection
 * where the works is automatically reorder
 * @param idCollection the collection to delete
 * @param idPassCollection where the works will pass
 * from the deleted collection by default is the 'General' collection
 * ==> General and WishList collection cannot delete
 */
exports.collectionDelete = function (req, res) {
    var idPassCollection = parseInt(req.body.idPassCollection, 10);

    var getCollectionToDeleteQuery = {where: {id: req.body.idCollection}, limit: 1};

    req.user.getCollections(getCollectionToDeleteQuery).then(function (collections) {
        var collection = collections[0];

        var deleteCollection = function () {
            collection.destroy().then(function () {
                return res.json(responses.collectionDeleted(collection));
            })
        };

        if (!collection)
            return res.json(responses.collectionNotExists(req.body.idCollection));

        if (!collection.isMutable())
            return res.json(responses.collectionIsInmutable(collection));

        if (!idPassCollection)
            return deleteCollection();

        collection.getWorks().then(function (works) {
            if (works.length < 1)
                return deleteCollection();

            var getPassCollectionQuery = {attributes: ['id'], where: {id: idPassCollection}, limit: 1};

            req.user.getCollections(getPassCollectionQuery).then(function (collections) {
                var passCollection = collections[0];
                if (!passCollection)
                    return res.json(responses.collectionCannotDelete(collection));

                getCollectionToDeleteQuery = {attributes: ['order'], order: '`order` DESC', limit: 1};

                passCollection.addWorks(works).then(function () {
                    passCollection.reorderAfterWorkAdded(works).then(deleteCollection);
                });
            });
        });
    });
};

/**
 * Collection reorder
 * ====================================================================
 * This execute only if the collection have more than one work
 * @param idCollection the collection where the works will reorder
 * @param orderWorks indicate the new order of the all works
 */
exports.collectionReOrder = function (req, res) {
    var orderWorks = req.body.orderWorks;

    var query = {attributes: ['id'], where: {id: req.body.idCollection}, limit: 1};

    req.user.getCollections(query).then(function (collections) {
        var collection = collections[0];

        if (!collection)
            return res.json(responses.collectionNotExists());

        query = {attributes: ['id', 'order']};

        collection.getWorks().then(function (works) {
            var getOrderByWork = function (work) {
                return _.result(_.findWhere(orderWorks, {id: work.id}), 'order');
            };

            var i, work, promises = [];
            for (i = 0; i < works.length; i++) {
                work = works[i];
                work.order = getOrderByWork(work);
                promises.push(work.save());
            }

            global.db.Sequelize.Promise.all(promises).then(function () {
                return res.json(responses.collectionReordered(collection));
            });
        });
    });
};

/**
 * Add work to collection
 * ====================================================================
 * Works belongs to many collections then this is added but maintaining
 * the user owner
 * @param idWork the work for added
 * @param idCollection the collection container
 */
exports.workAddCollection = function (req, res) {
    var promises = [
        global.db.Work.find(req.body.idWork),
        global.db.Collection.find(req.body.idCollection)
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var work = data[0], collection = data[1];

        if (!collection)
            responses.collectionNotExists(req.body.idCollection);

        if (!work)
            responses.workDontExists(req.body.idWork);

        collection
            .reorderAfterWorkAdded([work])
            .addWork(work).then(function () {
                responses.workAddedToCollection(work, collection);
            });
    });
};

/**
 * Switch work from a collection to another collection
 * ====================================================================
 * when an work pass to another collection this is deleted
 * from the old collection
 * @param idWork the work that will switch
 * @param idOldCollection the collection that currently belong the work
 * @param idNewCollection the collection container for the work
 */
exports.workSwitchCollection = function (req, res) {
    var promises = [
        global.db.Collection.find(req.body.idOldCollection),
        global.db.Collection.find(req.body.idNewCollection)
    ];

    global.db.Sequelize.Promise.all(promises).then(function (data) {
        var oldCollection = data[0], newCollection = data[1];

        if (!oldCollection)
            return res.json(responses.collectionNotExists(req.body.idOldCollection));

        if (!newCollection)
            return res.json(responses.collectionNotExists(req.body.idNewCollection));

        var query = {where: {id: req.body.idWork}, limit: 1};

        oldCollection.getWorks(query).then(function (works) {
            var work = works[0];

            if (!work)
                return res.json(responses.workNotBelongToCollection(req.body.idWork, oldCollection));

            reorderInCollection(work, newCollection).then(function () {
                promises = [
                    oldCollection.removeWork(work),
                    newCollection.addWork(work)
                ];
                global.db.Sequelize.Promise.all(promises).then(function (data) {
                    return res.json(responses.workSwitchedOfCollection(work, oldCollection, newCollection));
                });
            });
        });
    });
};


exports.workFeatured = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.featured().then(function () {
            return res.json({
                code: 202,
                message: 'Work featured'
            })
        });
    });
};

exports.workUnFeatured = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.unFeatured().then(function () {
            return res.json({
                code: 202,
                message: 'Work unFeatured'
            })
        });
    });
};


exports.userFeatured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.featured().then(function () {
            return res.json({
                code: 202,
                message: 'User featured'
            })
        });
    });
};

exports.userUnFeatured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.unFeatured().then(function () {
            return res.json({
                code: 202,
                message: 'User unFeatured'
            })
        });
    });
};

var responses = {
    message: function (code, message) {
        return {
            code: code,
            message: message
        }
    },
    successMessage: function () {
        return {
            code: 202,
            message: _.template(message)({
                work: work.name
            })
        };
    },

    workCreated: function (work) {
        var message = "Work {{ work }} created";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name
            })
        };
    },
    workDeleted: function (work, collection) {
        var message = "Work {{ work }} deleted from {{ collection }} collection";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name,
                collection: collection.name
            })
        };
    },
    workNeedCategories: function (collection) {
        var message = "Work {{ work }} need categories";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name
            })
        };
    },
    workNeedTags: function (collection) {
        var message = "Work {{ work }} need tags";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name
            })
        };
    },
    workDontExists: function (idWork) {
        var message = "Work with id {{ idWork }} not exists";
        return {
            code: 203,
            message: _.template(message)({
                idWork: idWork
            })
        }
    },
    collectionCreated: function (collection) {
        var message = "Collection  {{ collection }} created";
        return {
            code: 202,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    collectionCannotCreate: function (meta) {
        var message = "Cannot create a collection with meta {{ meta }}";
        return {
            code: 202,
            message: _.template(message)({
                meta: meta
            })
        }
    },
    collectionUpdated: function (collection) {
        var message = "Collection  {{ collection }} updated";
        return {
            code: 202,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    collectionIsInmutable: function (collection) {
        var message = "Collection  {{ collection }} is inmutable";
        return {
            code: 203,
            message: _.template(message)({
                collection: collection.name
            })
        }
    },
    collectionNotHaveWorks: function (collection) {
        var message = "Collection  {{ collection }} not have works";
        return {
            code: 203,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    collectionDeleted: function (collection) {
        var message = "Collection  {{ collection }} deleted";
        return {
            code: 202,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    collectionNotExists: function (idCollection) {
        var message = "Collection with id {{ idCollection }} don't exits";
        return {
            code: 203,
            message: _.template(message)({
                idCollection: idCollection
            })
        }
    },
    collectionReordered: function (collection) {
        var message = "Collection {{ collection }} reordered";
        return {
            code: 202,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    collectionCannotDelete: function (collection) {
        var message = "Collection {{ collection }} dont remove because " +
            "pass collection dont exists are equals";
        return {
            code: 203,
            message: _.template(message)({
                collection: collection.name
            }),
            collection: collection
        }
    },
    workAddedToCollection: function (work, collection) {
        var message = "Work {{ work }} added to Collection {{ collection }}";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name,
                collection: collection.name
            }),
            work: work
        }
    },
    workNotBelongToCollection: function (idWork, collection) {
        var message = "Work with id {{ idWork }} not belong to Collection {{ collection }}";
        return {
            code: 203,
            message: _.template(message)({
                idWork: idWork,
                collection: collection.name
            })
        }
    },
    workSwitchedOfCollection: function (work, oldCollection, newCollection) {
        var message = "Work {{ work }} switched from {{ oldCollection }} to {{ newCollection }} collection";
        return {
            code: 202,
            message: _.template(message)({
                work: work.name,
                oldCollection: oldCollection.name,
                newCollection: newCollection.name
            }),
            work: work
        };
    }
};

exports.image = function (req, res) {
    cloudinary.config({
        cloud_name: 'hackdudes',
        api_key: '337494525976864',
        api_secret: 'RQ2MXJev18AjVuf-mSNzdmu2Jsc'
    });

    cloudinary.uploader.upload('https://fbcdn-sphotos-a-a.akamaihd.net/hphotos-ak-xfa1/v/t1.0-9/10923216_10153009435556052_7682154786681906287_n.jpg?oh=cea4a6f9dd5429a5182146cc71ec81f7&oe=55D1138B&__gda__=1440007014_7ed8413772ff4f0a8c206c4c7329e354', {
        "width": 500,
        "height": 500,
        "crop": "thumb",
        gravity: "face",
        "effect": "saturation:-70"
    }, function (err, image) {
        console.log();
        console.log("** Remote Url");
        if (err) {
            console.warn(err);
        }
        console.log("* " + image.public_id);
        console.log("* " + image.url);
    });
};