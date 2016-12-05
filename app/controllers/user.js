var basePath = 'user/';

var searchDiscover = function(entity, req) {
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
  return global['search' + searchable](req).then(function(data) {
    var query = global.encodeToQuery(req.query);
    data.url = req.protocol + '://' + req.get('host') + '/user/' + req.profile.username + req.path + '?' + query;
    data.url = data.url.replace(tempValue, req.params.value);

    data.filters = {
      currentCategory: req.params.value,
      currentOrder: req.query.order
    };
    return data;
  });
};

var discover = function(req, res, entity) {
  // if (req.params.page !== 'page-1')
  //   return res.redirect(req.url.replace(req.params.page, 'page-1'));

  var promises = [searchDiscover(entity, req)];
  if (entity === 'works' || entity === 'users') {
    promises.push(global.db.Category.findAll({
      where: {
        meta: 0
      }
    }));
  } else if (entity === 'products') {
    promises.push(global.db.Category.findAll({
      where: {
        meta: 3
      }
    }));
  }

  return global.db.Sequelize.Promise.all(promises).then(function(data) {
    var order = global.config.search.orders[entity];

    order = global._.map(order, function(value, index) {
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
    return {
      data: data[0]
    };
  });
};

exports.search = function(entity, req, res) {
  return searchDiscover(entity, req).then(function(data) {
    return res.json(data);
  });
};

exports.profile = function(currentPath, req, res) {
  var query = req.owner ? {
    all: true
  } : {
    where: {
      public: true
    }
  };

  var promises = [
    req.profile.numOfWorks(query),
    req.profile.numOfProducts({
      where: {
        published: true
      }
    }),
    req.profile.numOfCollections(query),
    req.profile.numOfFollowings(),
    req.profile.numOfFollowers(),
    req.profile.calculateValoration()
  ];

  global.db.sequelize.Promise.all(promises).then(function(numbers) {
    if(currentPath === 'products'){
      discover(req, res, currentPath).then(function(discoverData) {
        var data = {
          currentPath: currentPath,
          profile: req.profile,
          numbers: numbers,
          discoverData: discoverData,
          cloudinary: global.cl,
          cloudinayCors: global.cl_cors
        };

        req.profile.view().then(function() {
          return res.render(basePath + 'index', data);
        });
      });
    }
    else{
      var data = {
        currentPath: currentPath,
        profile: req.profile,
        numbers: numbers,
        cloudinary: global.cl,
        cloudinayCors: global.cl_cors
      };

      req.profile.view().then(function() {
        return res.render(basePath + 'index', data);
      });
    }
  });
};

var getData = function(req, res, options, query) {
  options = global._.assign(options, {
    entity: req.profile,
    association: true,
    page: req.params.page,
    limit: 50
  });

  query = query || {};
  query = global._.assign(query, {
    build: true,
    viewer: req.viewer
  });
  return global.getPaginationEntity(options, query).then(function(result) {
    return res.json(result);
  });
};

exports.portfolio = function(req, res) {
  var query = req.owner ? {
    addUser: true
  } : {
    addUser: true,
    where: {
      public: true
    }
  };
  query.order = [global.getOrder('newest')];
  return getData(req, res, {
    method: 'getWorks',
    name: 'works'
  }, query);
};

exports.products = function(req, res) {
  var query = req.owner ? {
    addUser: true,
  } : {
    addUser: true,
    where: {
      published: true
    }
  };
  query.order = [global.getOrder('newest')];
  query.include = [{
    model: global.db.Work,
    attributes: ['photo']
  }];
  return getData(req, res, {
    method: 'getProducts',
    name: 'products',
    tempEntity: 'Product'
  }, query);
};


exports.collections = function(req, res) {
  var query = req.owner ? {
    addUser: true
  } : {
    addUser: true,
    where: {
      public: true
    }
  };
  query.order = [global.getOrder('newest')];
  return getData(req, res, {
    method: 'getCollections',
    name: 'collections'
  }, query);
};

exports.followers = function(req, res) {
  var query = {
    order: [
      [global.db.sequelize.col('Followers.createdAt'), 'DESC']
    ]
  }
  return getData(req, res, {
    method: 'getFollowers',
    name: 'followers'
  }, query);
};

exports.followings = function(req, res) {
  var query = {
    order: [
      [global.db.sequelize.col('Followers.createdAt'), 'DESC']
    ]
  }
  return getData(req, res, {
    method: 'getFollowings',
    name: 'followings'
  }, query);
};

var searchNotifications = function(req) {
  var verbs = [
    'like-work', 'follow-user', 'review-work', 'request-work',
    'denied-product', 'accepted-product'
  ];

  var query = {
    where: {
      UserId: {
        $not: [req.user.id]
      },
      OwnerId: req.user.id,
      verb: {
        $in: [verbs]
      }
    },
    group: ['verb', 'ObjectId', 'OwnerId', 'UserId'],
    order: [global.getOrder('newest')],
    include: [global.db.User],
    build: true,
    viewer: req.viewer,
    reverse: true
  };
  var page = req.params.page ? req.params.page : 'page-1';
  var options = {
    entity: 'Action',
    page: page,
    limit: 10
  };
  return global.getPaginationEntity(options, query);
};

exports.notificationsPage = function(req, res) {
  return searchNotifications(req).then(function(data) {
    var actionQuery = {
      where: {
        OwnerId: req.user.id
      }
    };
    global.db.Action.update({
      seen: 1
    }, actionQuery).then(function() {
      return res.render(basePath + 'notifications', {
        data: data
      });
    });
  });
};

exports.notifications = function(req, res) {
  searchNotifications(req).then(function(data) {
    return res.json(data);
  });
};

exports.isFollowing = function(req, res) {
  var query = {
    where: {
      id: req.userTo.id
    }
  };
  req.user.getFollowings(query).then(function(result) {
    return res.ok({
      following: (result.length > 0)
    }, 'following');
  });
};

exports.follow = function(req, res) {
  req.user.follow(req.userTo).then(function(followers) {
    var actionQuery = {
      where: {
        UserId: req.user.id,
        verb: 'follow-user',
        ObjectId: req.userTo.id,
        OwnerId: req.userTo.id
      }
    };
    global.db.Action.findOrCreate(actionQuery).then(function() {
      return res.ok({
        user: req.userTo,
        followers: followers
      }, 'seguido');
    });
  });
};

exports.unFollow = function(req, res) {
  req.user.unFollow(req.userTo).then(function(followers) {
    var actionQuery = {
      where: {
        UserId: req.user.id,
        ObjectId: req.userTo.id,
        verb: 'follow-user'
      }
    };
    global.db.Action.destroy(actionQuery).then(function() {
      return res.ok({
        user: req.userTo,
        followers: followers
      }, 'precedido');
    });
  });
};

exports.featured = function(req, res) {
  req.userTo.updateAttributes({
    featured: true
  }).then(function() {
    return res.ok({
      user: req.userTo
    }, 'Usuario recomendado');
  });
};

exports.unFeatured = function(req, res) {
  req.userTo.updateAttributes({
    featured: false
  }).then(function() {
    return res.ok({
      user: req.userTo
    }, 'Usuario censurado');
  });
};

exports.delete = function(req, res) {
  req.userTo.destroy().then(function() {
    return res.ok({
      user: req.userTo
    }, 'Usuario eliminado');
  });
};