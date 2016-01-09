var basePath = 'report/';
var moment = require('moment');


exports.index = function(req,res) {
  return res.render(basePath + 'index');
};

var searchData = function (req) {
  var query = {
    order: [global.getOrder('newest')],
    where: {}
  };

  if(req.query.term && req.query.termValue) {
    var term = req.query.term;
    if(term === 'isArtist' || term === 'verified' || term === 'filled' ) {
      query.where[req.query.term] = parseInt(req.query.termValue, 10) === 1 ? true : false;
    }else {
      query.where[req.query.term] = req.query.termValue;
    }
  }

  if(req.query.start && req.query.end) {
    query.where.createdAt = {
      $between: [moment(req.query.start, 'M-D-YYYY').toDate(), moment(req.query.end, 'M-D-YYYY').toDate()]
    };
  }

  var page = req.params.page ? req.params.page : 'page-1';
  var options = {
    entity: 'User',
    limit: 30,
    page: page
  };
  return global.getPaginationEntity(options, query);
};

exports.users = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req).then(function(data) {
    return res.render(basePath + 'users', {
      data: data
    });
  });
};


exports.works = function (req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req).then(function(data) {
    return res.render(basePath + 'works', {
      data: data
    });
  });
};

exports.search = function (req, res) {
  searchData(req).then(function (data) {
    return res.json(data);
  });
};
