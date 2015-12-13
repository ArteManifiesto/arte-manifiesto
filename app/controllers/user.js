var basePath = 'user/';
exports.profile = function (currentPath, req, res) {
  var query = req.owner ? {all: true} : {where: {public: true}};

  var promises = [
    req.profile.numOfWorks(query),
    req.profile.numOfCollections(query),
    req.profile.numOfFollowings(),
    req.profile.numOfFollowers(),
    req.profile.calcPopularity()
  ];

  global.db.sequelize.Promise.all(promises).then(function (numbers) {
    var data = {
      currentPath: currentPath,
      profile: req.profile,
      numbers: numbers,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    };

    if (req.owner)
      return res.render(basePath + 'index', data);

    ++req.profile.views;
    req.profile.save().then(function () {
      return res.render(basePath + 'index', data);
    });
  });
};

var getData = function (req, res, options, query) {
  options = global._.assign(options, {
    entity: req.profile, association: true,
    page: req.params.page, limit: 50
  });
  query = query || {};
  query = global._.assign(query, {build: true, viewer: req.viewer});
  return global.getPaginationEntity(options, query).then(function (result) {
    return res.json(result);
  });
};

exports.portfolio = function (req, res) {
  var query = req.owner ? {addUser: true} : {addUser: true, where: {public: true}};
  query.order = [global.getOrder('newest')];
  return getData(req, res, {method: 'getWorks', name: 'works'}, query);
};

exports.collections = function (req, res) {
  var query = req.owner ? {addUser: true} : {addUser: true, where: {public: true}};
  query.order = [global.getOrder('newest')];
  return getData(req, res, {method: 'getCollections', name: 'collections'}, query);
};

exports.followers = function (req, res) {
  var query = {order: [[global.db.sequelize.col('Followers.createdAt'), 'DESC']]}
  return getData(req, res, {method: 'getFollowers', name: 'followers'}, query);
};

exports.followings = function (req, res) {
  var query = {order: [[global.db.sequelize.col('Followers.createdAt'), 'DESC']]}
  return getData(req, res, {method: 'getFollowings', name: 'followings'}, query);
};

var searchNotifications = function (req) {
  var verbs = ['like-work', 'follow-user', 'review-work', 'request-work'];
  var query = {
    where: {
      UserId: {$not: [req.user.id]},
      OwnerId: req.user.id,
      verb: {$in: [verbs]}
    },
    order: [global.getOrder('newest')],
    include: [global.db.User],
    build: true, viewer: req.viewer, reverse: true
  };
  var page = req.params.page ? req.params.page : 'page-1';
  var options = {entity: 'Action', page: page, limit: 10};
  return global.getPaginationEntity(options, query);
};

exports.notificationsPage = function (req, res) {
  return searchNotifications(req).then(function (data) {
    global.db.Action.update({seen: 1}, {where: {OwnerId: req.user.id}}).then(function () {
      return res.render(basePath + 'notifications', {
        data: data
      });
    });
  });
};

exports.notifications = function (req, res) {
  searchNotifications(req).then(function (data) {
    return res.json(data);
  });
};

exports.isFollowing = function (req, res) {
  req.user.getFollowings({where: {id: req.userTo.id}}).then(function (result) {
    return res.ok({following: (result.length > 0)}, 'IsFollowing');
  });
};

exports.follow = function (req, res) {
  req.user.follow(req.userTo).then(function (followers) {
    var actionQuery = {UserId: req.user.id, verb: 'follow-user', ObjectId: req.userTo.id, OwnerId: req.userTo.id};
    global.db.Action.create(actionQuery).then(function () {
      return res.ok({user: req.userTo, followers: followers}, 'Usuario seguido');
    });
  });
};

exports.unFollow = function (req, res) {
  req.user.unFollow(req.userTo).then(function (followers) {
    var actionQuery = {where: {UserId: req.user.id, ObjectId: req.userTo.id, verb: 'follow-user'}};
    global.db.Action.destroy(actionQuery).then(function () {
      return res.ok({user: req.userTo, followers: followers}, 'Usuario precedido');
    });
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
