var basePath = 'report/';
var moment = require('moment');

exports.index = function(req, res) {
  return res.redirect(basePath + 'users/page-1');
};

var searchData = function(req, entity) {
  var query = {
    order: [global.getOrder('newest')],
    where: {}
  };
  if (entity === 'Work' || entity === 'Post' || entity === 'Product' || entity === 'ProductApplying') {
    query.addUser = true;
  }

  if (entity === 'Post') {
    query.attributes = ['id', 'name', 'nameSlugify', 'photo', 'description', 'published', 'featured',
      'views', 'popularity', 'createdAt', 'updatedAt'
    ];
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

  if (entity === 'Product') {
    query.where.published = true;
  }

  if (entity === 'ProductApplying') {
    entity = 'Product';
    query.where.applying = true;
  }

  var page = req.params.page ? req.params.page : 'page-1';
  var options = {
    entity: entity,
    limit: 30,
    page: page
  };
  return global.getPaginationEntity(options, query);
};

exports.users = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'User').then(function(data) {
    return res.render(basePath + 'users', {
      data: data
    });
  });
};


exports.works = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Work').then(function(data) {
    return res.render(basePath + 'works', {
      data: data
    });
  });
};

exports.brands = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Brand').then(function(data) {
    return res.render(basePath + 'brands', {
      data: data
    });
  });
};

exports.alerts = function(req, res) {
  global.db.Alert.findAll().then(function(alerts) {
    return res.render(basePath + 'alerts', {
      alerts: alerts
    });
  });
};

exports.alertAdd = function(req, res) {
  return res.render(basePath + 'alert-add');
};

exports.alertAddPost = function(req, res) {
  var afterCrud = function(alert) {
    return res.ok({alert: alert}, 'alert updated');
  };

  if(req.body.edit)
    return global.db.Alert.findById(req.body.idAlert).then(function(alert) {
      alert.updateAttributes(req.body).then(afterCrud);
    });

  global.db.Alert.create(req.body).then(afterCrud);
};

exports.alertEdit = function(req, res) {
  global.db.Alert.findById(req.params.idAlert).then(function(alert) {
    return res.render(basePath + 'alert-add', {
      alertToEdit: alert,
      edit: true
    });
  });
};

exports.activateAlert = function(req, res) {
  console.log('id alert : ', req.params.idAlert);

  global.db.Alert.findById(req.params.idAlert).then(function(alert) {
    alert.isActive = !alert.isActive;
    alert.save().then(function() {
      return res.ok({alert: alert}, 'alert updated');
    });
  });
};

exports.brandAds = function(req, res) {
  global.db.Brand.findById(req.params.idBrand).then(function(brand) {
    brand.getAdPacks({
      include:[global.db.AdPackType],
      order: [global.getOrder('newest')]
    }).then(function(adPacks) {
      return res.render(basePath + 'brand-ads', {
        brand: brand,
        adPacks: adPacks
      });
    });
  });  
};

exports.brandPackAdsList = function(req, res) {
  global.db.AdPack.findById(req.params.idAdPack).then(function(pack) {
    pack.getAds({
      include:[global.db.AdType],
      order: [global.getOrder('newest')]
    }).then(function(ads) {
      return res.render(basePath + 'pack-ads', {
        pack: pack,
        ads: ads
      });
    });
  });  
};

exports.adCreator = function(req, res) {
  global.db.Brand.findById(req.params.idBrand).then(function(brand) {
    global.db.AdPackType.findAll({
      include: [{
        model: global.db.AdType,
        as: 'Types'
      }]
    }).then(function(adPackTypes) {
      return res.render(basePath + 'ad-creator', {
        brand: brand,
        adPackTypes: adPackTypes
      });
    });
  });  
};

exports.activateAdPackCreator = function(req, res) {
  global.db.AdPack.findById(req.params.idAdPack).then(function(adPack) {
    adPack.isActive = !adPack.isActive;
    adPack.save().then(function() {
      return res.ok({adPack: adPack}, 'adPack updated');
    });
  });
};

exports.editAdPackCreator = function(req, res) {
  global.db.Brand.findById(req.params.idBrand).then(function(brand) {
    global.db.AdPack.find({
      where:{id:req.params.idAdPack},
      include:[global.db.AdPackType, global.db.Ad]
    }).then(function(adPack) {
      global.db.AdPackType.findAll({
        include: [{
          model: global.db.AdType,
          as: 'Types'
        }]
      }).then(function(adPackTypes) {
        return res.render(basePath + 'ad-creator', {
          edit: true,
          brand: brand,
          adPack: adPack,
          adPackTypes: adPackTypes
        });
      });
    });
  });  
};

exports.adCreatorPost = function(req, res) {
  global.db.Brand.findById(req.params.idBrand).then(function(brand) {
    var ads = JSON.parse(req.body.ads);
    var promises = [];
    req.body.startDate = moment(req.body.startDate, 'M-D-YYYY').toDate();
    req.body.endDate = moment(req.body.endDate, 'M-D-YYYY').toDate();

    if(req.body.edit) {
      global.db.AdPack.findById(req.body.adPackId).then(function(adPack) {
        adPack.updateAttributes(req.body).then(function() {
          var promises = [];
          adPack.getAds().then(function(adPackAds) {
            for(var i=0; i< adPackAds.length; i++) {
              promises.push(adPackAds[i].updateAttributes(ads[i]));
            }
            global.db.sequelize.Promise.all(promises).then(function(ads2) {
              return res.ok({ads: ads2}, 'ad updated');
            });            
          });
        });
      });
    } else {
      global.db.AdPack.create({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        AdPackTypeId: req.body.adPackType,
        BrandId: req.params.idBrand
      }).then(function(adPack) {
        promises = [];
        global._.map(ads, function(ad) {
          ad.AdPackId = adPack.id;
          ad.BrandId = req.params.idBrand;
          promises.push(global.db.Ad.create(ad));
        });

        global.db.sequelize.Promise.all(promises).then(function(ads2) {
          res.ok({ads: ads2}, 'ad created');
        });
      });
    }
  });  
};

exports.products = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Product').then(function(data) {
    return res.render(basePath + 'products', {
      data: data
    });
  });
};

exports.blog = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'Post').then(function(data) {
    return res.render(basePath + 'blog', {
      data: data
    });
  });
};

exports.createBrand = function(req, res) {
  console.log('create brand');
  console.log(req.body);

  if(!req.body.edit)
    global.db.Brand.create(req.body).then(function(brand) {
      return res.ok({brand: brand}, 'brand created');
    });

  global.db.Brand.findById(req.body.idBrand).then(function(brand) {
    brand.updateAttributes(req.body).then(function(){
      return res.ok({brand: brand}, 'brand updated');
    })
  });
};

exports.productsApplying = function(req, res) {
  if (req.params.page !== 'page-1')
    return res.redirect(req.url.replace(req.params.page, 'page-1'));

  searchData(req, 'ProductApplying').then(function(data) {
    return res.render(basePath + 'products_applying', {
      data: data
    });
  });
};


exports.general = function(req, res) {
  var shouldInterval = false,
    queryTemp;
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
  return global.db.sequelize.Promise.all(promises).then(function(data) {
    var numbers = [];
    for (var i = 0; i < data.length; i++) {
      numbers.push(data[i][0][0].total);
    }
    return res.render(basePath + 'general', {
      numbers: numbers
    });
  });

  var query = {
    where: {}
  };
  if (req.query.start && req.query.end) {
    var start = req.query.start;
    var end = req.query.end;
  }
};

exports.banners = function(req, res) {
  global.db.Banner.findAll({
    order: [
      ['name', 'ASC']
    ]
  }).then(function(banners) {
    res.render(basePath + 'banners', {
      banners: banners
    });
  });
};

exports.addBrand = function(req, res) {
  return res.render(basePath + 'add-brand');
};

exports.editBrand = function(req, res) {
  global.db.Brand.findById(req.params.idBrand).then(function(brand) {
    return res.render(basePath + 'add-brand', {
      edit: true,
      brand: brand
    });
  });
};

exports.editBanner = function(req, res) {
  global.db.Banner.findById(req.params.idBanner).then(function(banner) {
    return res.render(basePath + 'edit-banner', {
      banner: banner,
      cloudinary: global.cl,
      cloudinayCors: global.cl_cors
    });
  });
};

exports.productRevision = function(req, res) {
  var query = {
    where: {
      id: req.params.idProduct
    },
    addUser: true
  };
  global.db.Product.find(query).then(function(product) {
    if (!product || !product.applying) {
      return res.status(404).render('errors/404');
    }

    return res.render(basePath + 'product-revision', {
      product: product
    });
  });
};

exports.updateBanner = function(req, res) {
  global.db.Banner.findById(req.body.idBanner).then(function(banner) {
    banner.updateAttributes(req.body).then(function() {
      return res.ok({
        banner: banner
      }, 'Banner updated')
    });
  })
};

exports.updateProduct = function(req, res) {
  var query = {
    where: {
      id: req.body.idProduct
    },
    addUser: true
  };
  global.db.Product.find(query).then(function(product) {
    product.applying = false;
    product.published = req.body.published;
    var actionQuery = {
      where: {
        UserId: req.user.id,
        ObjectId: product.id,
        OwnerId: product.User.id
      }
    };

    if (!product.published) {
      actionQuery.where.verb = 'denied-product';
    } else {
      actionQuery.where.verb = 'accepted-product';
    }
    var promises = [
      product.save(),
      global.db.Action.findOrCreate(actionQuery)
    ];
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var action = result[1][0],
        isNew = result[1][1];
      var data = JSON.stringify({
        reason: req.body.reason,
        message: req.body.message
      });
      var query = 'UPDATE Actions SET createdAt=NOW(), seen=?, data =? WHERE id=?';
      global.db.sequelize.query(query, {
        replacements: [false, data, action.id]
      }).then(function() {
        return res.ok({
          product: result
        }, 'product');
      });
    });
  });
};

exports.search = function(entity, req, res) {
  searchData(req, entity).then(function(data) {
    return res.json(data);
  });
};