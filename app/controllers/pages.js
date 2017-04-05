var basePath = 'pages/';

exports.index = function(req, res) {
  if (!req.isAuthenticated())
    return res.redirect('/featured');

  return res.redirect('/feed');

  // return res.redirect()
  // var promises = [];
  // var query = {
  //   where: {
  //     meta: 3
  //   }
  // };
  // promises.push(global.db.Category.findAll(query));
  // var bannersQuery = {
  //   order: [
  //     ['name', 'ASC']
  //   ]
  // };
  // promises.push(global.db.Banner.findAll(bannersQuery));

  // global.db.Sequelize.Promise.all(promises).then(function(result) {
  //   return res.render(basePath + 'new-landing', {
  //     categories: result[0],
  //     banners: result[1]
  //   });
  // });
};
exports.sell = function(req, res) {
  return res.redirect('/user/' + req.user.username + '/account/seller');
};

exports.bth = function(req, res) {
  return res.redirect('https://kuestionario.typeform.com/to/Ho97sq');
};

exports.featured = function(req, res) {
  return res.render(basePath + 'featured');
};

exports.artjam = function(req, res) {
  return res.redirect('https://artemanifiesto.typeform.com/to/FelGDk');
};

exports.adClick = function(req, res) {
  global.db.Ad.findById(req.body.adId).then(function(ad) {
    ad.clicks = ad.clicks + 1;
    ad.save().then(function() {
      return res.ok({ad: ad}, 'ad clicked');
    })
  });
};

exports.pp = function(req, res) {
  return res.render(basePath + 'pp');
};

exports.landing = function(req, res) {
  return res.render(basePath + 'landing');
};

exports.editor = function(req, res) {
  return res.render(basePath + 'editor');
};

var searchFeed = function(req) {
  return req.user.getFollowings().then(function(result) {
    var followings = global._.pluck(result, 'id');

    var query = {
      where: {
        OwnerId: {
          $not: [req.viewer]
        },
        UserId: {
          $in: followings
        },
        verb: {
          $in: global.feedVerbs
        }
      },
      order: [global.getOrder('newest')],
      group: ['verb', 'ObjectId', 'OwnerId', 'UserId'],
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

exports.feedPage = function(req, res) {

  var baseAdQuery = {
    order: [global.db.sequelize.fn('RAND')],
    where: {isActive: true},
    include: [{
      model: global.db.Ad,
      include: {
        model: global.db.AdType,
        where: {}
      }
    }]
  };

  var promises = [
    req.user.numOfFollowers(),
    req.user.numOfWorks(),
    req.user.numOfFollowings(),
    searchFeed(req)
  ];

  baseAdQuery.include.limit = 1;
  baseAdQuery.include[0].include.where.name = 'rect';

  promises.push(global.db.AdPack.findAll(baseAdQuery));

  baseAdQuery.include.limit = 1;
  baseAdQuery.include[0].include.where.name = 'quad';

  promises.push(global.db.AdPack.findAll(baseAdQuery));
  
  baseAdQuery.limit = 3;
  baseAdQuery.include[0].include.where.name = 'horizontal';

  promises.push(global.db.AdPack.findAll(baseAdQuery));

  return global.db.sequelize.Promise.all(promises).then(function(result) {
    var adPacks = global._.slice(result, 4, 7);
    var ads = [];
    global._.map(adPacks, function(adPack) {
      global._.map(adPack, function(ad) {
        ads.push(ad.Ads[0]);
      });
    });
    
    promises = [];
    global._.map(ads, function(ad) {
      ad.views = ad.views + 1;
      promises.push(ad.save());
    });

    return global.db.sequelize.Promise.all(promises).then(function() {
      return res.render(basePath + 'feed', {
        numbers: global._.slice(result, 0, 3),
        data: result[3],
        ads: ads
      });
    });    
  });
};

exports.feed = function(req, res) {
  searchFeed(req).then(function(data) {
    return res.json(data);
  });
};

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
    data.url = req.protocol + '://' + req.get('host') + req.path + '?' + query;
    data.url = data.url.replace(tempValue, req.params.value);

    data.filters = {
      currentCategory: req.params.value,
      currentOrder: req.query.order
    };
    return data;
  });
};

var discover = function(req, res, entity, categories) {
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
        id: categories
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

exports.works = function(req, res) {
  discover(req, res, 'works').then(function(data) {
    return res.render(basePath + 'works', data);
  });
};

exports.users = function(req, res) {
  discover(req, res, 'users').then(function(data) {
    return res.render(basePath + 'users', data);
  });
};

exports.collections = function(req, res) {
  discover(req, res, 'collections').then(function(data) {
    return res.render(basePath + 'collections', data);
  });
};

exports.products = function(req, res) {
  var categories = [];
  global.db.Product.findAll({
    where:{
      published: true
    },
    include: [{
      model: global.db.Category,
      include: [{
        model: global.db.Category,
        as: 'ParentCategory'
      }]
    }]
  }).then(function(data){
    for(i in data){
      if(categories.indexOf(data[i].Category.ParentCategory.id) == -1) categories.push(data[i].Category.ParentCategory.id);
    }
    discover(req, res, 'products', categories).then(function(data) {
      return res.render(basePath + 'products', data);
    });
  });
};

exports.landing = function(req, res) {
  return res.render(basePath + 'landing');
};

exports.lab = function(req, res) {
  return res.render(basePath + 'lab');
};

exports.labredirect = function(req, res) {
  return res.redirect('/laboratorio_de_impresion_digital_giclee_arte_y_fotografia');
};

exports.marketredirect = function(req, res) {
  return res.redirect('/products/category/all/page-1/?order=newest&featured=1');
};


exports.success = function(req, res) {
  return res.json({
    status: 'success'
  });
  return res.render(basePath + 'success');
};

exports.failed = function(req, res) {
  return res.json({
    status: 'failed'
  });
  return res.render(basePath + 'failed');
};

exports.search = function(entity, req, res) {
  return searchDiscover(entity, req).then(function(data) {
    return res.json(data);
  });
};

exports.subscribe = function(req, res) {
  var emailParam = {
    email: req.body.email
  };
  var query = {
    where: emailParam,
    defaults: emailParam
  };
  global.db.Subscriber.findOrCreate(query).then(function(data) {
    var subscriber = data[0],
      created = data[1];
    return res.ok({
      subscriber: subscriber,
      created: created
    }, 'OK');
  });
};