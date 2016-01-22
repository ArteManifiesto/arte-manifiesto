var basePath = 'pages/';

exports.index = function (req, res) {
  var basicQuery = {
    where: {featured: true},
    addUser: true,
    build: true,
    viewer: req.viewer
  };

  var promises = [];

  basicQuery.limit = global.limits.usersHome;
  promises.push(global.db.User.findAll(basicQuery));

  basicQuery.limit = global.limits.worksHome;
  promises.push(global.db.Work.findAll(basicQuery));

  var query = {limit: global.limits.categoriesHome};
  promises.push(global.db.Category.findAll(query));

  global.db.Sequelize.Promise.all(promises).then(function (result) {
    return res.render(basePath + 'index', {
      users: result[0],
      works: result[1],
      categories: result[2]
    });
  });
};

exports.landing = function(req, res) {
  return res.render(basePath + 'landing');
};

var searchFeed = function (req) {
  return req.user.getFollowings().then(function (result) {
    var followings = global._.pluck(result, 'id');

    var query = {
      where: {
        OwnerId: {$not: [req.viewer]},
        UserId: {$in: followings},
        verb: {$in: global.feedVerbs}
      },
      order: [global.getOrder('newest')],
      addUser: true,
      build: true,
      viewer: req.viewer
    };

    var page = req.params.page ? req.params.page : 'page-1';
    var options = {
      entity: 'Action',
      limit: global.limits.feed,
      page: page
    };

    return global.getPaginationEntity(options, query);
  });
};

exports.feedPage = function (req, res) {
  var promises = [
    req.user.numOfFollowers(),
    req.user.numOfWorks(),
    req.user.numOfFollowings(),
    searchFeed(req)
  ];

  return global.db.sequelize.Promise.all(promises).then(function (result) {
    return res.render(basePath + 'feed', {
      numbers: global._.slice(result, 0, 3),
      data: result[3]
    });
  });
};

exports.feed = function (req, res) {
  searchFeed(req).then(function (data) {
    return res.json(data);
  });
};

var searchDiscover = function (entity, req) {
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
    };
    return data;
  });
};

var discover = function (req, res, entity) {
  if(req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  var promises = [searchDiscover(entity, req)];
  entity !== 'collections' && promises.push(global.db.Category.findAll());

  return global.db.Sequelize.Promise.all(promises).then(function (data) {
    var order = global.config.search.orders[entity];

    order = global._.map(order, function (value, index) {
      var esName;
      switch (value) {
        case 'popularity':
          esName = 'popularidad';
          break;
        case 'hottest':
          esName = 'caliente';
          break;
        case 'newest':
          esName = 'mas nuevo';
          break;
        case 'price_asc':
          esName = 'precios ↑';
          break;
        case 'price_desc':
          esName = 'precios ↓';
          break;
      }
      return {
        value: value,
        name: esName
      }
    });
    data[0].filters.categories = entity !== 'collections' ? data[1] : [];
    data[0].filters.order = order;
    return {data: data[0]};
  });
};

exports.works = function (req, res) {
  discover(req, res, 'works').then(function (data) {
    return res.render(basePath + 'works', data);
  });
};

exports.users = function (req, res) {
  discover(req, res, 'users').then(function (data) {
    return res.render(basePath + 'users', data);
  });
};

exports.collections = function (req, res) {
  discover(req, res, 'collections').then(function (data) {
    return res.render(basePath + 'collections', data);
  });
};

exports.landing = function (req, res) {
  return res.render(basePath + 'landing');
};

exports.search = function (entity, req, res) {
  return searchDiscover(entity, req).then(function (data) {
    return res.json(data);
  });
};

exports.subscribe = function (req, res) {
  var emailParam = {email: req.body.email};
  var query = {where: emailParam, defaults: emailParam};
  global.db.Subscriber.findOrCreate(query).then(function (data) {
    var subscriber = data[0], created = data[1];
    return res.ok({subscriber: subscriber, created: created}, 'OK');
  });
};
