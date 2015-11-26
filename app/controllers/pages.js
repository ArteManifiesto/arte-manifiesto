var basePath = 'pages/';
var Promise = require('bluebird');
var request = require('request');

exports.index = function (req, res) {
  if(req.user) {
    req.user.getFollowings().then(function(followings) {
        var followingsArray = global._.pluck(followings, 'id');
        var verbs = ['like-work', 'follow-user','create-work'];
        var query = {where: {UserId: {$in: followingsArray},
        OwnerId:{$not: [req.viewer]},
        verb:{$in:[verbs]}
      }, order:[global.getOrder('newest')],
        include:[global.db.User],
        build:true, viewer:req.viewer
      }
      global.db.Action.findAll(query).then(function(actions) {
        // return res.json({actions:actions});
        return res.render('pages/index', {
          actions: actions
        });
      });
    });
  } else {
    var queryUsers = {where: {featured: true}, limit: 4, build: true, addUser: true, viewer: req.viewer};
    var queryWorks = {where: {featured: true}, limit: 15, build: true, addUser: true, viewer: req.viewer};
    var promises = [
      global.db.User.findAll(queryUsers),
      global.db.Work.findAll(queryWorks)
    ];

    return global.db.Sequelize.Promise.all(promises).then(function (result) {
      global.db.Work.findById(24005).then(function(work) {
        return res.render('pages/index-org', {
          users: result[0],
          works: result[1],
          cloudinary: global.cl,
          cloudinayCors: global.cl_cors,
          manifest: work.manifest
        });
      });
    });
  }
};

var searchHandler = function (entity, req, res) {
  var config = global.config.search;
  entity = global.getParameter(config.entities, entity);

  req.query.order = global.getParameter(config.orders[entity], req.query.order);

  if (req.query.time)
    req.query.time = global.getParameter(config.times, req.query.time);

  var item, currentParams = config.params[entity];

  for (item in req.query)
    if (currentParams.indexOf(item) == -1)
      delete req.query[item];

  var searchable = global._.capitalize(entity);
  var tempValue = req.params.value;
  return global['search' + searchable](req).then(function (data) {
    var query = global.encodeToQuery(req.query);
    data.url = req.protocol + '://' + req.get('host') + req.path + '?' + query;
    data.url = data.url.replace(tempValue, req.params.value);
    data.filters = {
      currentCategory: req.params.value,
      currentOrder: req.query.order
    }
    return res.json(data);
  });
};

var searchBridge = function (req) {
  var url = req.protocol + '://' + req.get('host') + req.url;
  url = url.replace(req.params.page, 'page-1');

  var payload = {method: 'POST', url: url, body: {viewer: req.viewer}, json: true};

  return new Promise(function (resolve, reject) {
    request.post(payload, function (error, response, body) {
      resolve(body);
    });
  });
};

var discover = function (req, entity) {
  var promises = [searchBridge(req)];
  entity !== 'collections' && promises.push(global.db.Category.findAll());

  return global.db.Sequelize.Promise.all(promises).then(function (data) {
    var order = global.config.search.orders[entity];
    data[0].filters.categories = entity !== 'collections' ? data[1] : [];
    data[0].filters.order = order;
    return {data: data[0]};
  });
};

exports.works = function (req, res) {
  discover(req, 'works').then(function (data) {
    return res.render(basePath + 'works', data);
  });
};

exports.users = function (req, res) {
  discover(req, 'users').then(function (data) {
    return res.render(basePath + 'users', data);
  });
};

exports.collections = function (req, res) {
  discover(req, 'collections').then(function (data) {
    return res.render(basePath + 'collections', data);
  });
};

exports.search = function (entity, req, res) {
  if (!req.body.viewer)
    return searchHandler(entity, req, res);

  req.viewer = req.body.viewer;
  return searchHandler(entity, req, res);
};
