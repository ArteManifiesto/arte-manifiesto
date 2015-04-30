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
    var currentPath = req.path.replace('/', '');
    if (currentPath.length == '') currentPath = 'portfolio';

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
        return res.render('user/index', {
            currentPath: currentPath,
            profile: req.profile,
            owner: req.owner,
            data: data
        });
    });
};

exports.portfolio = function (req, res) {
    global.getPortfolioCollection(req.profile).then(function (collection) {
        var options = {
            query: 'getWorksOfCollection', entity: 'works', viewer: req.viewer,
            collection: collection.id, user: req.profile.id,
            page: req.params.page, limit: 1
        };
        global.getPaginationData(options).then(function (data) {
            return res.json(data);
        });
    });
};

exports.likesWorks = function (req, res) {
    var options = {
        query: 'getLikesOfUser', entity: 'likes', viewer: req.viewer,
        user: req.profile.id, page: req.params.page, limit: 1
    };
    global.getPaginationData(options).then(function (data) {
        return res.json(data);
    });
};

exports.products = function (req, res) {

};

var collectionsByMeta = function (req, meta) {
    var options = {
        query: 'getCollectionsByMeta', entity: meta, viewer: req.viewer,
        meta: meta, user: req.profile.id,
        page: req.params.page, limit: 1
    };
    return global.getPaginationData(options);
};

exports.collectionsWorks = function (req, res) {
    collectionsByMeta(req, 'works').then(function (data) {
        return res.json(data);
    });
};

exports.collectionsProducts = function (req, res) {
    collectionsByMeta(req, 'products').then(function (data) {
        return res.json(data);
    });
};

var getRelation = function (req, relation) {
    var options = {
        query: 'relations', entity: relation, viewer: req.viewer,
        relation: relation, user: req.profile.id,
        page: req.params.page, limit: 10
    };
    return global.getPaginationData(options).then(function (data) {
        var records = global.mergeEntity(data[relation], ['Works']);
        _.map(records, function (value, key) {
            value['Works'] = _.slice(value['Works'], 0, 6);
        });
        data[relation] = records;
        return data;
    });
};

exports.followers = function (req, res) {
    getRelation(req, 'followers').then(function (data) {
        return res.json(data);
    });
};

exports.followings = function (req, res) {
    getRelation(req, 'followings').then(function (data) {
        return res.json(data);
    });
};

//TODO make middlewate for check if user exists
exports.follow = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.follow(req.user).then(function (followers) {
            return res.ok(followers, 'User Followed');
        });
    });
};

exports.unfollow = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.unFollow(req.user).then(function (followers) {
            return res.ok(followers, 'User unFollowed');
        });
    });
};

exports.featured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.updateAttributes({featured: true}).then(function () {
            return res.ok('User featured');
        });
    });
};

exports.unfeatured = function (req, res) {
    global.db.User.find(req.body.idUser).then(function (user) {
        user.updateAttributes({featured: false}).then(function () {
            return res.ok('User unFeatured');
        });
    });
};
