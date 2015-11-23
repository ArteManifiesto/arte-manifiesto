var basePath = 'user/';
exports.profile = function (currentPath, req, res) {
  var query = req.owner ? {all: true} : {where:{public:true}};
  var promises = [
      req.profile.numOfWorks(query),
      req.profile.numOfCollections(query),
      req.profile.numOfFollowings(),
      req.profile.numOfFollowers()
  ];
  global.db.sequelize.Promise.all(promises).then(function (numbers) {
      return res.render(basePath + 'index', {
          currentPath: currentPath,
          profile: req.profile,
          numbers: numbers,
          cloudinary: global.cl,
          cloudinayCors: global.cl_cors,
      });
  });
};

var getData = function (req, res, options, query) {
    options = global._.assign(options, {
        entity: req.profile, association: true,
        page: req.params.page, limit: 10
    });
    query = query || {}
    query = global._.assign(query, {build: true, viewer: req.viewer});
    return global.getPaginationEntity(options, query).then(function (result) {
        return res.json(result);
    });
}

exports.portfolio = function (req, res) {
  var query = req.owner ? {addUser: true, all: true} : {addUser: true};
  return getData(req, res, {method: 'getWorks', name: 'works'}, query);
};

exports.collections = function (req, res) {
  var query = req.owner ? {addUser: true, all: true} : {addUser: true};
  return getData(req, res, {method: 'getCollections', name: 'collections'}, query);
};

exports.followers = function (req, res) {
    return getData(req, res, {method: 'getFollowers', name: 'followers'});
};

exports.followings = function (req, res) {
    return getData(req, res, {method: 'getFollowings', name: 'followings'});
};

exports.isFollowing = function (req, res) {
  req.user.getFollowings({where:{id: req.userTo.id}}).then(function(result){
    return res.ok({following: (result.length > 0) }, 'IsFollowing');
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
