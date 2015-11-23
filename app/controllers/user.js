var basePath = 'user/';
var _ = require('lodash');
var cloudinary = require('cloudinary').v2;
process.env.CLOUDINARY_URL = 'cloudinary://337494525976864:RQ2MXJev18AjVuf-mSNzdmu2Jsc@hackdudes'
cloudinary.config();

exports.profile = function (currentPath, req, res) {
  var publicQuery = req.owner ? {} : {where:{public:true}};
  var promises = [
      req.profile.numOfWorks(), req.profile.numOfProducts(),
      req.profile.numOfCollections(publicQuery),
      req.profile.numOfFollowings(),
      req.profile.numOfFollowers()
  ];
  var cloudinary_cors = "http://" + req.headers.host + "/cloudinary_cors.html";
  global.db.sequelize.Promise.all(promises).then(function (data) {
      return res.render(basePath + 'index', {
          currentPath: currentPath,
          profile: req.profile,
          owner: req.owner,
          data: data,
          cloudinary_cors: cloudinary_cors,
          cloudinary: cloudinary
      });
  });
};

var getData = function (req, res, options, query) {
    options = _.assign(options, {
        entity: req.profile, association: true,
        page: req.params.page, limit: 10
    });
    query = query || {}
    query = _.assign(query, {build: true, viewer: req.viewer});
    return global.getPaginationEntity(options, query).then(function (result) {
        return res.json(result);
    });
}

exports.portfolio = function (req, res) {
  var query = req.owner ? {addUser: true} : {addUser: true, where:{public:true}};
  return getData(req, res, {method: 'getWorks', name: 'works'}, query);
};

exports.store = function (req, res) {
  var query = req.owner ? {addUser: true} : {addUser: true, where:{public:true}};
  return getData(req, res, {method: 'getProducts', name: 'products'}, query);
};

exports.collections = function (req, res) {
  var query = req.owner ? {addUser: true} : {addUser: true, where:{public:true}};
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
