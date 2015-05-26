var basePath = 'user/';

exports.profile = function (req, res) {
    var currentPath = req.path.replace('/', '');
    if (currentPath.length === '') currentPath = 'portfolio';

    var promises = [
        req.profile.numOfWorks(), req.profile.numOfProducts(),
        req.profile.numOfLikesToWorks(), req.profile.numOfLikesToProducts(),
        req.profile.numOfCollections(), req.profile.numOfFollowers(),
        req.profile.numOfFollowings()
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

exports.portfolio = function (req, res) {
    var options = {
        entity: req.profile, method: 'getWorks', association: true,
        name: 'works', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.products = function (req, res) {
    var options = {
        entity: req.profile, method: 'getProducts', association: true,
        name: 'products', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.likesWorks = function (req, res) {
    var options = {
        entity: req.profile, method: 'getWorkLikes', association: true,
        name: 'works', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.likesProducts = function (req, res) {
    var options = {
        entity: req.profile, method: 'getProductLikes', association: true,
        name: 'products', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.collections = function (req, res) {
    var options = {
        entity: req.profile, method: 'getCollections', association: true,
        name: 'collections', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.followers = function (req, res) {
    var options = {
        entity: req.profile, method: 'getFollowers', association: true,
        name: 'followers', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
};

exports.followings = function (req, res) {
    var options = {
        entity: req.profile, method: 'getFollowings', association: true,
        name: 'followings', page: req.params.page, limit: 2
    };

    global.getPaginationEntity(options, {build: true}).then(function (result) {
        return res.json(result);
    });
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
