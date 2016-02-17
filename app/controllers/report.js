var basePath = 'report/';
var moment = require('moment');


exports.index = function (req, res) {
  return res.redirect(basePath + 'users/page-1');
};

var searchData = function (req, entity) {
  var query = {
    order: [global.getOrder('newest')],
    where: {}
  };
  if (entity === 'Work' || entity === 'Post') {
    query.addUser = true;
  }

  if(entity === 'Post') {
    query.attributes = ['id', 'name', 'nameSlugify', 'photo', 'description', 'published', 'featured',
    'views', 'popularity', 'createdAt', 'updatedAt'];
  }

  if (req.query.term && req.query.termValue) {
    var term = req.query.term;
    if (term === 'isArtist' || term === 'verified' || term === 'filled' ||
     term === 'featured' || term === 'published') {
      query.where[req.query.term] = parseInt(req.query.termValue, 10) === 1 ? true : false;
    } else {
      query.where[req.query.term] = req.query.termValue;
    }
  }

  if (req.query.start && req.query.end) {
    query.where.createdAt = {
      $between: [moment(req.query.start, 'M-D-YYYY').toDate(), moment(req.query.end, 'M-D-YYYY').toDate()]
    };
  }

  if(entity === 'UserSeller') {
    query.where.applying = true;
    entity = 'User';
  }

  var page = req.params.page ? req.params.page : 'page-1';
  var options = {
    entity: entity,
    limit: 30,
    page: page
  };
  return global.getPaginationEntity(options, query);
};

exports.users = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'User').then(function (data) {
    return res.render(basePath + 'users', {
      data: data
    });
  });
};


exports.works = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Work').then(function (data) {
    return res.render(basePath + 'works', {
      data: data
    });
  });
};

exports.blog = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Post').then(function (data) {
    return res.render(basePath + 'blog', {
      data: data
    });
  });
};

exports.sellersApplying = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'UserSeller').then(function (data) {
    return res.render(basePath + 'sellers_applying', {
      data: data
    });
  });
};


exports.general = function (req, res) {
  var shouldInterval = false, queryTemp;
  if (req.query.start && req.query.end) {
    shouldInterval = true;
    var start = moment(req.query.start).format('YYYY-MM-DD');
    var end = moment(req.query.end).format('YYYY-MM-DD');

    queryTemp = " WHERE (createdAt BETWEEN '" + start + "' AND '" + end + "')";
  }
  queryTemp = (shouldInterval ? queryTemp : "");

  var promises = [
    global.db.sequelize.query("SELECT COUNT(id) as total FROM Works" + queryTemp),
    global.db.sequelize.query("SELECT COUNT(WorkId) as total FROM WorkLikes" + queryTemp),
    global.db.sequelize.query("SELECT COUNT(id) as total FROM Collections" + queryTemp),
    global.db.sequelize.query("SELECT COUNT(WorkId) as total FROM CollectionWork" + queryTemp),
    global.db.sequelize.query("SELECT COUNT(WorkId) as total FROM WorkRequests" + queryTemp)
  ]
  return global.db.sequelize.Promise.all(promises).then(function (data) {
    var numbers = [];
    for (var i = 0; i < data.length; i++) {
      numbers.push(data[i][0][0].total);
    }
    return res.render(basePath + 'general', {numbers: numbers});
  });

  var query = {where: {}};
  if (req.query.start && req.query.end) {
    var start = req.query.start;
    var end = req.query.end;
  }
};

exports.banners = function (req, res) {
  global.db.Banner.findAll({order:[['name', 'ASC']]}).then(function (banners) {
    res.render(basePath + 'banners', {
      banners: banners
    });
  });
};

exports.editBanner = function (req, res) {
  global.db.Banner.findById(req.params.idBanner).then(function (banner) {
    return res.render(basePath + 'edit-banner', {
      banner: banner,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    });
  });
};

exports.updateBanner = function (req, res) {
  global.db.Banner.findById(req.body.idBanner).then(function(banner) {
    banner.updateAttributes(req.body).then(function() {
      return res.ok({banner: banner}, 'Banner updated')
    });
  })
};

exports.search = function (entity, req, res) {
  searchData(req, entity).then(function (data) {
    return res.json(data);
  });
};
