var basePath = 'user/';
var _ = require('lodash');

exports.profile = function (req, res) {
    var currentPath = req.path.replace('/', '');
    if (currentPath === '') currentPath = 'portfolio';

    var promises = [
        req.profile.numOfWorks(), req.profile.numOfProducts(),
        req.profile.numOfCollections(),
        req.profile.numOfFollowings(),
        req.profile.numOfFollowers()
    ];

    global.db.sequelize.Promise.all(promises).then(function (data) {
        return res.render(basePath + 'index', {
            currentPath: currentPath,
            profile: req.profile,
            owner: req.owner,
            data: data
        });
    });
};

var getData = function (req, res, options, query) {
    options = _.assign(options, {
        entity: req.profile, association: true,
        page: req.params.page, limit: 30
    });
    query = query || {}
    query = _.assign(query, {build: true, viewer: req.viewer});
    return global.getPaginationEntity(options, query).then(function (result) {
        return res.json(result);
    });
}

exports.portfolio = function (req, res) {
    return getData(req, res, {method: 'getWorks', name: 'works'}, {addUser: true});
};

exports.store = function (req, res) {
    return getData(req, res, {method: 'getProducts', name: 'products'}, {addUser: true});
};

exports.likesWorks = function (req, res) {
    return getData(req, res, {method: 'getWorkLikes', name: 'works'}, {addUser: true});
};

exports.likesProducts = function (req, res) {
    return getData(req, res, {method: 'getProductLikes', name: 'products'}, {addUser: true});
};

exports.collections = function (req, res) {
    //var query = {where: {meta: 'products'}};
    return getData(req, res, {method: 'getCollections', name: 'collections'}, {addUser: true});
};

exports.followers = function (req, res) {
    return getData(req, res, {method: 'getFollowers', name: 'followers'});
};

exports.followings = function (req, res) {
    return getData(req, res, {method: 'getFollowings', name: 'followings'});
};

exports.follow = function (req, res) {
    req.user.follow(req.userTo).then(function (followers) {
        return res.ok({user: req.userTo, followers: followers}, 'Usuario seguido');
    });
};

exports.unFollow = function (req, res) {
    req.user.unFollow(req.userTo).then(function (followers) {
        return res.ok({user: req.userTo, followers: followers}, 'Usuario precedido');
    });
};

exports.featured = function (req, res) {
    req.userTo.updateAttributes({featured: true}).then(function () {
        return res.ok({user: req.userTo}, 'Usuario recomendado');
    });
};

exports.unFeatured = function (req, res) {
    req.userTo.updateAttributes({featured: false}).then(function () {
        return res.ok({user: req.userTo}, 'Usuario censurado');
    });
};
