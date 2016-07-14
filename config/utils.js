var moment = require('moment');
var email = require('../app/controllers/email');
var _ = require('lodash');

global.limits = {
  usersHome: 4,
  worksHome: 15,
  categoriesHome: 8,
  feed: 10,
  blog: 20,
  singlePost: 3,
  singleChapter: 3
};

global.cities = [
    'Lima',
    'Arequipa',
    'Trujillo',
    'Chiclayo',
    'Iquitos',
    'Piura',
    'Cusco',
    'Chimbote',
    'Huancayo',
    'Tacna',
    'Juliaca',
    'Ica',
    'Cajamarca',
    'Pucallpa',
    'Sullana',
    'Ayacucho',
    'Chincha',
    'Huánuco',
    'Huacho',
    'Tarapoto',
    'Puno',
    'Huaraz',
    'Tumbes',
    'Pisco',
    'Huaral',
    'Moyobamba',
    'Puerto Maldonado',
    'Moquegua',
    'Cerro de Pasco',
    'Barranca',
    'Yurimaguas',
    'Chancay',
    'Andahuaylas',
    'Ilo',
    'Talara',
    'Abancay',
    'Lambayeque',
    'Tingo María',
    'Chulucanas',
    'Sicuani',
    'Mala',
    'Huancavelica',
    'Pacasmayo',
    'Tarma',
    'Sechura',
    'Guadalupe',
    'Bagua'
  ];
global.feedVerbs = ['like-work', 'follow-user', 'create-work'];

global.fbPermissions = [
  'email'     , 'user_about_me',
  'user_birthday', 'user_friends',
  'user_website'
];

global.lift = function (app) {
  var server = app.listen(app.get('port'), function () {
    var url = 'http://127.0.0.1:' + server.address().port + '/auth/login';
    console.log('Express server listening  on ' + url);
  });
};

global.config = {
  search: {
    entities: ['works', 'users', 'products', 'collections'],
    orders: {
      works: ['newest', 'popularity', 'hottest'],
      users: ['popularity', 'newest', 'hottest'],
      collections: ['newest'],
      products: ['newest', 'popularity', 'hottest', 'price_asc', 'price_desc']
    },
    times: ['day', 'week', 'month', 'year'],
    params: {
      works: ['order', 'time', 'featured', 'term'],
      users: ['order', 'time', 'featured', 'term'],
      collections: ['order', 'time', 'featured', 'term'],
      products: ['order', 'time', 'name', 'featured', 'lo_p', 'hi_p', 'term']
    }
  }
};

global.getStoreCollection = function (user) {
  var query = {store: true, limit: 1};
  return user.getCollections(query).then(function (collections) {
    return collections[0];
  });
};

global.goToLogin = function(req, res, message){
  var returnTo = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.cookie('return_to', returnTo, {maxAge: 3600000, domain: '.' + global.cf.app.domain});
  req.flash('errorMessage', message);
  return res.redirect('/auth/login');
};

global.nameSlugify = function (scope, value) {
  var time = moment().format('DDMMYYhhmmss');
  var nSlugifyTemp = scope.getDataValue('nameSlugify');
  if (nSlugifyTemp) {
    var nSlugify = nSlugifyTemp.split('-');
    var nSlugifyTime = parseInt(nSlugify[nSlugify.length - 1], 10);
    if (_.isNumber(nSlugifyTime)) {
      scope.setDataValue('nameSlugify', global.slugify(value + '-' + nSlugifyTime));
    } else {
      scope.setDataValue('nameSlugify', global.slugify(value + '-' + time));
    }
  } else {
    scope.setDataValue('nameSlugify', global.slugify(value + '-' + time));
  }
  scope.setDataValue('name', value);
}
global.slugify = function (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

global.discoverGenerator = function (entity, req) {
  var options = {};
  options.entity = entity;
  options.name = 'items';
  options.page = req.params.page;
  options.limit = 25;

  var query = {where: {}, build: true};
  query.viewer = req.viewer;
  query.order = [global.getOrder(req.query.order)]

  if (req.query.featured)
    query.where.featured = true;

  if (req.query.time)
    query.where.createdAt = {
      $between: [moment().startOf(req.query.time).toDate(), moment().toDate()]
    };
  console.log('query order =>');
  console.log(query.order);
  if(req.query.order === 'hottest') {
    query.where.createdAt = {
      $between: [moment().subtract(7, 'd').toDate(), moment().toDate()]
    };
  }
  if (req.query.lo_p || req.query.hi_p)
    query.where.finalPrice = {
      $between: [req.query.lo_p || 0, req.query.hi_p || 3000]
    };

  if (req.query.term) {
    if (entity === 'Work' || entity === 'Product') {
      if (req.query.term.substring(0, 1) !== '#') {
        query.where.$and = global.db.sequelize.literal(
          "MATCH(" + entity +".name, " + entity + ".description) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
        );
      }

      if (req.query.term.substring(0, 1) === '#') {
        if (req.params.value !== 'all') {
          query.include = [{model: global.db.Category, where: {nameSlugify: req.params.value}}]
        }
      }
    }
    if (entity === 'User') {
      query.where.$and = global.db.sequelize.literal(
        "MATCH(firstname, lastname, username, pseudonimo) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
      );
    }
    if (entity === 'Collection') {
      query.where.$and = global.db.sequelize.literal(
        "MATCH(name, description) AGAINST('" + req.query.term + "' IN BOOLEAN MODE)"
      );
    }
  }
  return {options: options, query: query};
}

var beforePagination = function (req, discover) {
  var isTag = false;

  var tempEntity = discover.options.entity;
  discover.options.tempEntity = tempEntity;
  var query = {where: {nameSlugify: req.params.value}};
  var tempModel = 'Category';
  if (req.query.term && req.query.term.substring(0, 1) === '#') {
    query = {where: {name: req.query.term.substring(1, req.query.term.length)}};
    tempModel = 'Tag';
  } else {
    if (req.params.value === 'all') {
      return global.getPaginationEntity(discover.options, discover.query);
    }
  }

  console.log('tempmodel:', tempModel, tempEntity);
  return global.db[tempModel].find(query).then(function (model) {
    if (!model)
      return global.getPaginationEntity(discover.options, discover.query, true)

    if(tempModel === 'Category' && tempEntity === 'Product') {
      return global.db.Category.findAll({where: {
        ParentCategoryId: model.id
      }}).then(function(categories) {
        console.log('categories');
        console.log(categories);
        console.log(_.pluck(categories, 'id'));
        // global.db.Product.findAll({where: {
        //   CategoryId: {$in: _.pluck(categories, 'id')}
        // }});
        tempModel = 'Product';
        discover.query.where.CategoryId = {$in: _.pluck(categories, 'id')};
        return global.getPaginationEntity(discover.options, discover.query);
      });
      // global.db.Category.findAll({where: {P}})
    }


    var method;
    switch (tempEntity) {
      case 'Work':
        method = 'getWorks';
        break;
      case 'User':
        method = 'getSpecialties';
        break;
      case 'Product':
        method = 'getProducts';
        break;
    }
    discover.options.entity = model;
    discover.options.method = method;
    discover.options.association = true;

    return global.getPaginationEntity(discover.options, discover.query);
  });
}

global.searchWorks = function (req) {
  var discover = discoverGenerator('Work', req);
  discover.query.where.public = true;
  discover.query.addUser = true;
  discover.query.order.push([global.db.sequelize.col('id')]);
  return beforePagination(req, discover);
};

global.searchUsers = function (req) {
  var discover = discoverGenerator('User', req);
  discover.query.where.firstname = {ne: null};
  discover.query.where.username = {$not: ['artemanifiesto']};
  discover.query.order.push([global.db.sequelize.col('id')]);
  return beforePagination(req, discover);
};

global.searchCollections = function (req) {
  var discover = discoverGenerator('Collection', req);
  discover.query.where.public = true;
  discover.query.where.meta = 'works';
  discover.query.addUser = true;
  discover.query.order.push([global.db.sequelize.col('id')]);
  console.log('order ===>');
  console.log(discover.query.order);
  return beforePagination(req, discover);
};

global.searchProducts = function (req) {
  var discover = discoverGenerator('Product', req);
  discover.query.where.published = true;
  discover.query.addUser = true;
  discover.query.include = discover.query.include || [];
  discover.query.include.push(global.db.Work);
  discover.query.order.push([global.db.sequelize.col('id')]);

  return beforePagination(req, discover);
};

global.getPagination = function (page, limit) {
  var split = parseInt(page.split('-')[1], 10);
  page = _.isNaN(split) ? 1 : split;
  page = page > 10000 ? 1 : page;
  var offset = page > 0 ? ((page - 1) * limit) : 0;
  return {page: page, limit: limit, offset: offset};
};

global.getParameter = function (data, value) {
  var index = data.indexOf(value);
  if (index < 0)index = 0;
  return data[index];
};

global.getUrlParameter = function (url, sParam) {
  var sPageURL = url.substring(1)
  var sURLVariables = sPageURL.split('&')
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=')
    if (sParameterName[0] == sParam)
      return sParameterName[1]
  }
};

global.encodeToQuery = function (data) {
  var ret = [];
  var param;
  for (param in data)
    ret.push(encodeURIComponent(param) + "=" + encodeURIComponent(data[param]));
  return ret.join("&");
};

global.getOrder = function (order) {
  switch (order) {
    case 'popularity':
    case 'hottest':
      order = [global.db.sequelize.col('popularity'), 'DESC'];
      break;
    case 'newest':
      order = [global.db.sequelize.col('createdAt'), 'DESC'];
      break;
    case 'price_asc':
      order = [global.db.sequelize.col('finalPrice'), 'ASC'];
      break;
    case 'price_desc':
      order = [global.db.sequelize.col('finalPrice'), 'DESC'];
      break;
  }
  return order;
};

global.emails = {
  verify: function (req, options) {
    options.subject = 'Arte Manifiesto - Confirmación de email'
    return email.send(req, options, 'verify').then();
  },
  forgot: function (req, options) {
    options.subject = 'Arte Manifiesto - Cambio de contraseña'
    return email.send(req, options, 'forgot').then();
  },
  availability: function (req, options) {
    options.subject = 'Arte Manifiesto - Disponibilidad de Obra'
    return email.send(req, options, 'availability').then();
  }
};


global.getPaginationEntity = function (options, query, empty) {
  var pages = global.getPagination(options.page, options.limit);
  query = _.assign(query, {offset: pages.offset, limit: pages.limit});

  if (empty)
    return {
      items: [],
      pagination: {
        total: 0, page: pages.page, limit: pages.limit,
        pages: Math.ceil(0 / pages.limit)
      }
    };

  var promises = [];
  if (!options.association) {
    console.log('query====>');
    console.log(query);

    promises = [global.db[options.entity].findAll(query)]
    query = _.omit(query, 'build', 'offset', 'limit', 'addUser', 'group');
    promises.push(global.db[options.entity].count(query));
  }
  else {
    promises = [options.entity[options.method](query)];
    query = _.omit(query, 'build', 'addUser');
    var identifier = options.tempEntity ? options.tempEntity + '.id' : 'id';
    query.attributes = ['*',
      [global.db.sequelize.fn('COUNT', global.db.sequelize.col(identifier)), 'total']
    ];
    query = _.omit(query, 'build', 'offset', 'limit');
    promises.push(options.entity[options.method](query));
  }

  return global.db.Sequelize.Promise.all(promises).then(function (data) {
    console.log(data[1]);
    var total, result = {items: data[0]};
    if (!options.association)
      total = data[1];
    else
      total = data[1][0].getDataValue('total');
    result.pagination = {
      total: total,
      page: pages.page,
      limit: pages.limit,
      pages: Math.ceil(total / pages.limit)
    };
    return result;
  });
};

global.objectToParameters = function (element) {
  return Object.keys(element).map(function (key) {
    return key + '=' + element[key];
  }).join('&');
};

global.replaceAt = function (text, index, character) {
  return text.substr(0, index) + character + text.substr(index + character.length);
};

global.getOnly = function (entity, items) {
  return {};
};


global.beforeFind = function (options, fn) {
  if (options.addUser) {
    options.include = options.include || [];
    options.include.push({model: global.db.User});
  }
  fn(null, options);
};

global.afterFind = function (items, options, fn) {
  if ((items === null) ||
    (_.isArray(items) && items.length < 1))
    return fn(null, options);

  if (options.build) {
    var promises = [];
    var addPromise = function (item) {
      if (options.build)
        promises.push(item.buildParts(options));
    };

    if (!_.isArray(items))
      addPromise(items);

    for (var i = 0; i < items.length; i++)
      addPromise(items[i]);

    return global.db.Sequelize.Promise.all(promises).then(function () {
      return fn(null, options);
    });
  }
  return fn(null, options);
}
