var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');
var request = require('request');

exports.profile = function (req, res) {
    var path = req.path.replace('/', '');
    if (path.length == '') path = 'portfolio';

    var promises = [
        global.getNumCollectionsOfUser({user: req.profile.id, meta: 'portfolio'}),
        global.getNumLikesOfUser({user: req.profile.id}),
        global.getNumCollectionsOfUser({user: req.profile.id, meta: 'store'}),
        global.getNumCollectionsOfUser({user: req.profile.id, meta: 'works'}),
        global.getNumCollectionsOfUser({user: req.profile.id, meta: 'products'}),
        global.getNumFollowersOfUser({user: req.profile.id}),
        global.getNumFollowingsOfUser({user: req.profile.id})
    ];

    global.db.sequelize.Promise.all(promises).then(function (data) {
        return res.render('user/profile', {
            path: path,
            profile: req.profile,
            owner: req.owner,
            data: data
        });
    });
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
        var params = {viewer: req.viewer, collection: collection.id};
        global.getWorksOfCollection(params).then(function (data) {
            return res.json(data);
        });
    });

    /*global.getPortfolioCollection(req.profile).then(function (collection) {
     var options = {collection: collection.id, page: req.params.page, limit: 10};
     getPaginationData('getWorksOfPortfolio', options).then(function (data) {
     return res.json(data);
     });
     });*/
};

exports.likes = function (req, res) {
    /*
     req.profile.getLikes().then(function (likes) {
     return res.json(likes);
     });
     */
    /*
     var options = {viewer: req.viewer, user: req.profile.id, page: req.params.page, limit: 2};
     getPaginationData('getLikes', options).then(function (data) {
     return res.json(data);
     });
     */
    /*
     var query = {
     limit: 2,
     where: {public: true},
     include: [
     {model: global.db.User, as: 'Likes'},
     {model: global.db.User}
     ]
     };
     req.profile.getLikes(query).then(function (likes) {
     return res.json(likes);
     });
     */
};


exports.products = function (req, res) {
    global.getStoreCollection(req.profile).then(function (collection) {
        collection.getWorks().then(function (works) {

        });
        /*
         var options = {collection: collection.id, page: req.params.page, limit: 10};
         getPaginationData('getProductsOfStore', options).then(function (data) {
         return res.json(data);
         });
         */
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
    req.profile.getFollowings().then(function (followings) {
        res.json(followings.length);
    });

    /*
     var options = {viewer: req.viewer, user: req.profile.id, page: req.params.page, limit: 10, type: 'followings'};
     getPaginationData('followers', options).then(function (data) {
     var records = global.mergeEntity(data.records, ['Works']);
     _.map(records, function (value, key) {
     value['Works'] = _.slice(value['Works'], 0, 6);
     });
     return res.json({followings: records, pagination: data.pagination});
     });
     */
};

//TODO make middlewate for check if user exists
exports.follow = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.follow(req.user).then(function (followers) {
            return res.ok({followers: followers}, 'User Followed');
        });
    });
};

exports.unfollow = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.unFollow(req.user).then(function (followers) {
            return res.ok({followers: followers}, 'User unFollowed');
        });
    });
};

exports.featured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.featured().then(function () {
            return res.ok('User featured');
        });
    });
};

exports.unfeatured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.unFeatured().then(function () {
            return res.ok('User unFeatured');
        });
    });
};
