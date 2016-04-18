var basePath = 'user/product/';
var paypal = require('paypal-rest-sdk');

exports.index = function(req, res) {
  req.product.getUser().then(function(user) {
    req.product.getMoreProducts().then(function(categories) {
      return res.json(categories);
    });
  });

  // var promises = [
  //   req.product.more(),
  //   req.product.similar(req.viewer),
  //   req.product.getTags(),
  //   req.product.getReviews({include: [global.db.User]}),
  //   req.product.getUserArtworks()
  // ];
  // global.db.Sequelize.Promise.all(promises).then(function (result) {
  //   var query = {
  //     where: {id: req.product.id},
  //     include: [global.db.Category],
  //     viewer: req.viewer,
  //     build: true,
  //     addUser: true
  //   };
  //   global.db.Product.find(query).then(function (product) {
  //     var data = {
  //       entity: 'product',
  //       owner: req.owner,
  //       product: product,
  //       more: result[0],
  //       similar: result[1],
  //       tags: result[2],
  //       reviews: result[3],
  //       works: result[4]
  //     };
  //     return res.render(basePath + 'index', data);
  //
  //     // product.view().then(function () {
  //     // });
  //   });
  // });
  // });
  //
  // var promises = [
  //     req.product.more(),
  //     req.product.similar(req.viewer)
  // ];
  // global.db.Sequelize.Promise.all(promises).then(function (result) {
  //   req.product.getCategory().then(function(category) {
  //     req.product.setDataValue('Category', category);
  //     req.product = req.product.toJSON();
  //     return res.render(basePath + 'index', {
  //       profile: req.profile,
  //       product: req.product,
  //       more: result[0], similar: result[1]
  //     });
  //   });
  // });
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
  req.product.like(req.user).then(function(likes) {
    return res.ok({
      product: req.product,
      likes: likes
    }, 'Product liked');
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

exports.unLike = function(req, res) {
  req.product.unLike(req.user).then(function(likes) {
    return res.ok({
      product: req.product,
      likes: likes
    }, 'Product unLiked');
  });
};

exports.addToCollection = function(req, res) {
  var collections = req.body.collections;
  var query = {
    viewer: req.viewer,
    collections: collections
  };
  req.product.addToCollection(query).then(function(data) {
    return res.ok({
      collection: collections
    }, 'Product added to collections , this is a magic mdf :]');
  });
}


exports.removeFromCart = function(req, res) {

};