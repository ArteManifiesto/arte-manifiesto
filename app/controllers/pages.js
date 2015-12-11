var basePath = 'pages/';

exports.index = function (req, res) {
  var queryUsers = {where: {featured: true}, limit: 4, build: true, addUser: true, viewer: req.viewer};
  var queryWorks = {where: {featured: true}, limit: 15, build: true, addUser: true, viewer: req.viewer};
  var promises = [
    global.db.User.findAll(queryUsers),
    global.db.Work.findAll(queryWorks),
    global.db.Category.findAll({limit:8})
  ];
  return global.db.Sequelize.Promise.all(promises).then(function (result) {
      return res.render(basePath + 'index', {
        users: result[0], works: result[1],
        categories: result[2]
      });
  });
};

exports.editor = function(req, res) {
  return res.render(basePath + 'editor');
};

exports.feedPage = function (req, res ) {
    var promises = [
      req.user.numOfFollowers(),
      req.user.numOfWorks(),
      req.user.numOfFollowings(),
      searchFeed(req)
    ];

    return global.db.sequelize.Promise.all(promises).then(function (data) {
      var feedData = data[3];
      if(feedData.length > 1 ) {
        return res.render('pages/feed', {
          numbers: global._.slice(data, 0, 3),
          data: feedData
        });
      }

      var queryUsers = {where: {featured: true}, limit: 4, build: true, addUser: true, viewer: req.viewer};
      global.db.User.findAll(queryUsers).then(function(users){
        return res.render('pages/feed', {
          numbers: global._.slice(data, 0, 3),
          users: users,
          data: feedData
        });
      });
    });
}

var searchFeed = function(req) {
  return req.user.getFollowings().then(function(followings) {
    var followingsArray = global._.pluck(followings, 'id');
    var verbs = ['like-work', 'follow-user','create-work'];
    var query = {
      where: {
        UserId: {$in: followingsArray},
        OwnerId:{$not: [req.viewer]}, verb:{$in:[verbs]}
      },
      order:[global.getOrder('newest')],
      include:[global.db.User],
      build:true, viewer:req.viewer
    };
    var page = req.params.page ? req.params.page : 'page-1';
    var options = {entity: 'Action', page: page, limit: 10};
    return global.getPaginationEntity(options, query);
  });
}

exports.feed = function(req, res){
  searchFeed(req).then(function(data){
    return res.json(data);
  });
}

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
    return data;
  });
};

var discover = function (req,res, entity) {
  if(req.params.page !== 'page-1') {
    var url = req.url.replace(req.params.page, 'page-1');
    return res.redirect(url);
  }

  var promises = [searchHandler(entity, req, res)];
  entity !== 'collections' && promises.push(global.db.Category.findAll());

  return global.db.Sequelize.Promise.all(promises).then(function (data) {
    var order = global.config.search.orders[entity];

    order = global._.map(order, function(value, index) {
			var esName;
			switch(value) {
				case 'popularity': esName = 'popularidad';break;
				case 'hottest': esName = 'caliente';break;
				case 'newest': esName = 'mas nuevo';break;
				case 'price_asc': esName = 'precios ↑';break;
				case 'price_desc': esName = 'precios ↓';break;
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
  discover(req,res, 'works').then(function (data) {
    return res.render(basePath + 'works', data);
  });
};

exports.users = function (req, res) {
  discover(req,res, 'users').then(function (data) {
    return res.render(basePath + 'users', data);
  });
};

exports.collections = function (req, res) {
  discover(req, res,'collections').then(function (data) {
    return res.render(basePath + 'collections', data);
  });
};

exports.search = function (entity, req, res) {
  return searchHandler(entity, req, res).then(function(data) {
    return res.json(data);
  });
};
