var basePath = 'user/product/';
var paypal = require('paypal-rest-sdk');
// var request = require('request');
// var cheerio = require('cheerio');
var moment = require('moment');
var crypto = require('crypto');


exports.index = function(currentPath, req, res) {
  req.product.getWork().then(function(work) {
    var promises = [
      work.getTags(),
      req.product.view(),
      req.product.getReviews({
        include: [{
          model: global.db.User,
          attributes: {
            exclude: ['email', 'hashedPassword', 'salt', 'tokenVerifyEmail', 'tokenResetPassword', 'tokenResetPasswordExpires']
          }
        }]
      })
    ];
    global.db.Sequelize.Promise.all(promises).then(function(result) {
      var query = {
        where: {
          id: req.product.id
        },
        include: [{
          model: global.db.Category,
          include: [{
            model: global.db.Category,
            as: 'ParentCategory'
          }]
        }],
        viewer: req.viewer,
        build: true,
        addUser: true
      };
      global.db.Product.find(query).then(function(product) {
        global.db.Work.find({where:{id:product.WorkId}}).then(function(work) {
          global.db.Product.findAll({
            where:{
              CategoryId:product.CategoryId,
              featured:true,
              published:true,
              id:{
                $notIn: [product.id]
              }
            },
            include: [{
                model: global.db.User
              }]
          }).then(function(similar) {
            global.db.Product.findAll({
              where:{
                WorkId:product.WorkId,
                featured:true, 
                published:true,
                id:{
                  $notIn: [product.id]
                }
              },
              include: [{
                model: global.db.User
              }]
            }).then(function(more) {
              global.db.Product.findAll({
                where:{
                  WorkId:product.WorkId
                },
                include: [{
                  model: global.db.Category,
                  include: [{
                    model: global.db.Category,
                    as: 'ParentCategory'
                  }]
                }],
                addUser: true
              }).then(function(categories) {
                var data = {
                  currentPath: currentPath,
                  entity: 'product',
                  owner: req.owner,
                  work: work,
                  product: product,
                  more: more,
                  similar: similar,
                  tags: result[0],
                  reviews: result[1],
                  categories: categories
                };
                return res.render(basePath + 'index', data);
              });
            });
          });
        });
      });
    });
  });
};

exports.create = function(req, res) {
  req.body.UserId = req.user.id;
  var product = JSON.parse(req.body.data);
  product.isActive = true;
  global.cl.uploader.upload(product.photo).then(function(result) {
    console.log(product.photo);
    product.photo = result.url;
    console.log(product.photo);
    global.db.Product.create(product).then(function(result) {
      return res.ok({
        products: result
      }, 'Producto creado');
    });
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
  var merchantId = "575661";
  var apiKey = "tUutsCnKZQ0VGwmB9Yq9XnqbO2";
  var reference = req.product.id + '_' + req.product.UserId + '_' + moment().format('DDMMYYhhmmssSS');
  var amount = 5 + parseInt(req.product.finalPrice);
  var currency = "PEN";
  var signature = apiKey + "~" + merchantId + "~" + reference + "~" + amount + "~" + currency;
  var payu = {
    merchant: merchantId,
    account: "578459",
    description: req.product.name + ' by ' +req.product.User.fullname,
    reference: reference,
    amount: amount,
    currency: currency,
    signature: crypto.createHash('md5').update(signature).digest("hex"),
    confirmation: req.protocol + '://' + req.get('host') + '/user/' + req.profile.username + '/product/' + req.product.nameSlugify + '/payu'
  }
  return res.render(basePath + 'buy', {
    payu: payu,
    product: req.product,
    cities: global.cities
  });
};

exports.successPage = function(req, res) {
  // var orderData = req.cookies.order_data;
  // res.clearCookie('order_data', {
  //   domain: '.' + global.cf.app.domain
  // });

  // if (!orderData) return res.redirect('/');

  // global.db.Order.create({
  //   ProductId: req.product.id,
  //   UserId: req.user.id,
  //   SellerId: req.product.User.id,
  //   status: 'recibido',
  //   data: orderData
  // }).then(function(order) {
    return res.render(basePath + 'success', {
      product: req.product
    });
  // });
};

exports.canceledPage = function(req, res) {
  return res.render(basePath + 'canceled', {
    product: req.product
  });
};

// exports.buy = function(req, res) {
//   var url = 'http://themoneyconverter.com/ES/PEN/USD.aspx';
//   return request.get(url, function(error, response, body) {
//     $ = cheerio.load(body);

//     var rate = Number($('.switch-table').find('b').text().replace(',', '.'));
//     var price = Number(req.body.price) * rate;

//     var payment = {
//       "intent": "sale",
//       "payer": {
//         "payment_method": "paypal"
//       },
//       "redirect_urls": {},
//       "transactions": [{
//         "amount": {
//           "total": Number(price.toString().match(/^\d+(?:\.\d{0,2})?/)),
//           "currency": 'USD'
//         },
//         "description": req.product.description
//       }]
//     };

//     req.product.getUser().then(function(user) {
//       var baseUrl = req.protocol + '://' + req.get('host') + '/user/' +
//         user.username + '/product/' + req.product.nameSlugify;

//       payment.redirect_urls.return_url = baseUrl + '/success';
//       payment.redirect_urls.cancel_url = baseUrl + '/canceled';

//       paypal.payment.create(payment, function(error, payment) {
//         if (error) {
//           console.log(error);
//         } else {
//           if (payment.payer.payment_method === 'paypal') {
//             req.paymentId = payment.id;
//             var redirectUrl;
//             console.log(payment);
//             for (var i = 0; i < payment.links.length; i++) {
//               var link = payment.links[i];
//               if (link.method === 'REDIRECT') {
//                 redirectUrl = link.href;
//               }
//             }
//             res.redirect(redirectUrl);
//           }
//         }
//       });
//     });
//   });
// };

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

exports.shipping = function(req, res) {
  var url = 'http://www.olvacourier.com/calculadora/calcular.php';

  var config = JSON.parse(req.body.config);
  request.post(
    url, {
      form: config
    },
    function(error, response, body) {
      return res.ok({
        data: JSON.parse(body)
      }, 'shipping');
    }
  );
};

exports.submit = function(req, res) {
  var data = JSON.parse(req.body.data);
  global.db.Order.create({
    ProductId: req.product.id,
    UserId: req.user.id,
    SellerId: req.product.User.id,
    status: 'En Espera',
    signature: data.signature,
    reference: data.reference,     
    data: req.body.data
  }).then(function(order) {
    return res.ok({
      data: order
    }, 'created');
  });
}

exports.removeSubmit = function(req, res) {
  // global.db.Order.destroy({
  //   where: {
  //     reference: req.cookies.referenceCode,
  //     status: 'En Espera'
  //   }
  // }).then(function(order) {
  //   res.clearCookie('referenceCode', {
  //     domain: '.' + global.cf.app.domain
  //   });
    return res.ok({
      data: order
    }, 'cleaned');
  // });
}

exports.payuResponse = function(req, res) {
  var message = "";
  if(req.body.state_pol == 4) message = "Aprobado";   
  if(req.body.state_pol == 5) message = "Expirado";   
  if(req.body.state_pol == 6) message = "Rechazado";   

  global.db.Order.update({
      status: message
    },
    { where: {
      reference: req.body.reference_sale
    }
    }).then(function(order) {
      return res.ok({
        data: order
      }, 'payu');
    });
};