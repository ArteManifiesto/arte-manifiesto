var basePath = 'user/product/';
var paypal = require('paypal-rest-sdk');

exports.index = function(currentPath, req, res) {
  req.product.getWork().then(function(work) {
    var promises = [
      work.more(),
      work.similar(req.viewer),
      work.getTags(),
      req.product.getReviews({include: [global.db.User]}),
      req.product.getMoreProducts()
    ];
    global.db.Sequelize.Promise.all(promises).then(function (result) {
      var query = {
        where: {id: req.product.id},
        include: [global.db.Category],
        viewer: req.viewer,
        build: true,
        addUser: true
      };
      global.db.Product.find(query).then(function (product) {
        var data = {
          currentPath: currentPath,
          entity: 'product',
          owner: req.owner,
          product: product,
          more: result[0],
          similar: result[1],
          tags: result[2],
          reviews: result[3],
          categories: result[4]
        };
        return res.render(basePath + 'index', data);
      });
    });
  });
};

exports.create = function(req, res) {
  req.body.UserId = req.user.id;
  var products = JSON.parse(req.body.products);

  var promises = [],
    product;

  for (var i = 0; i < products.length; i++) {
    product = products[i];
    product.UserId = req.user.id;
    // console.log(product);
    promises.push(global.db.Product.create(product));
  }

  // return res.ok({products: 'elle'}, 'Producto creado');

  global.db.Sequelize.Promise.all(promises).then(function(result) {
    return res.ok({
      products: result
    }, 'Producto creado');
  });
};


exports.featured = function(req, res) {
  req.product.updateAttributes({
    featured: true
  }).then(function() {
    return res.ok({
      product: req.product
    }, 'Product featured');
  });
};

exports.unFeatured = function(req, res) {
  req.product.updateAttributes({
    featured: false
  }).then(function() {
    return res.ok({
      product: req.product
    }, 'Product unFeatured');
  });
};

exports.like = function(req, res) {
  req.product.getUser().then(function(user) {
    var actionQuery = {
      where: {
        UserId: req.user.id,
        verb: 'like-product',
        ObjectId: req.product.id,
        OwnerId: user.id
      }
    };
    global.db.Action.findOrCreate(actionQuery).then(function() {
      req.product.like(req.user).then(function(likes) {
        return res.ok({
          work: req.product,
          likes: likes
        }, 'Product liked');
      });
    });
  });
};

exports.buyPage = function(req, res) {
  return res.render(basePath + 'buy', {
    product: req.product
  });
};

exports.successPage = function(req, res) {
  global.db.Order.create({
    ProductId: req.product.id,
    UserId: req.user.id,
    SellerId: req.product.User.id,
    status: 'recibido'
  }).then(function(order) {
    return res.render(basePath + 'success', {
      product: req.product
    });
  });
};

exports.canceledPage = function(req, res) {
  return res.render(basePath + 'canceled', {
    product: req.product
  });
};

exports.buy = function(req, res) {
  var payment = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {},
    "transactions": [{
      "amount": {
        "total": parseInt(req.product.finalPrice),
        "currency": 'USD'
      },
      "description": req.product.description
    }]
  };

  req.product.getUser().then(function(user) {
    var baseUrl = req.protocol + '://' + req.get('host') + '/user/' +
      user.username + '/product/' + req.product.nameSlugify;

    payment.redirect_urls.return_url = baseUrl + '/success';
    payment.redirect_urls.cancel_url = baseUrl + '/canceled';

    paypal.payment.create(payment, function(error, payment) {
      if (error) {
        console.log(error);
      } else {
        if (payment.payer.payment_method === 'paypal') {
          req.paymentId = payment.id;
          var redirectUrl;
          console.log(payment);
          for (var i = 0; i < payment.links.length; i++) {
            var link = payment.links[i];
            if (link.method === 'REDIRECT') {
              redirectUrl = link.href;
            }
          }
          res.redirect(redirectUrl);
        }
      }
    });
  });
};

/**
 * create a review
 */
exports.createReview = function(req, res) {
  req.body.ProductId = parseInt(req.body.idProduct, 10);
  req.body.UserId = parseInt(req.viewer, 10);

  global.db.Review.create(req.body).then(function(review) {
    var query = {
      where: {
        id: review.id
      },
      include: [global.db.User]
    };
    var promises = [
      global.db.Review.find(query),
      req.product.getUser()
    ];
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var actionQuery = {
        UserId: req.user.id,
        verb: 'review-product',
        ObjectId: req.product.id,
        OwnerId: result[1].id
      };
      global.db.Action.create(actionQuery).then(function() {
        return res.ok({
          review: result[0]
        }, 'Review creado');
      });
    });
  });
};

exports.unLike = function(req, res) {
  req.product.unLike(req.user).then(function(likes) {
    return res.ok({
      product: req.product,
      likes: likes
    }, 'Product unLiked');
  });
};

exports.addToCollection = function(req, res) {
  var collections = JSON.parse(req.body.collections);
  var query = {
    viewer: req.viewer,
    collections: collections
  };
  req.product.addToCollection(query).then(function() {
    return res.ok({
      collections: collections
    }, 'Product added to collections , this is a magic mdf :]');
  });
}

exports.insideCollection = function(req, res) {
  var insideQuery = {
    where: {
      UserId: req.user.id
    }
  };
  req.product.getCollections(insideQuery).then(function(collections) {
    return res.ok({
      collections: collections
    }, 'Collections');
  });
};

exports.removeFromCart = function(req, res) {

};
