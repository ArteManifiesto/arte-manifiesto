var basePath = 'user/product/';

exports.index = function (currentPath, req, res) {
    req.product.views += 1;
    var promises = [
      req.product.save(),
      req.product.userLikes(),
      req.product.more(),
      req.product.similar(req.viewer),
      req.product.getTags(),
      req.product.getReviews({include:[global.db.User]})
    ];
    global.db.Sequelize.Promise.all(promises).then(function (result) {
      var query = { where:{id: req.product.id}, include:[global.db.ProductType],
        viewer: req.viewer, build: true, addUser: true
      }
      global.db.Product.find(query).then(function(product) {
        return res.render('user/work/' + 'index', {
            entity: 'product',
            owner : req.owner,
            currentPath: currentPath,
            element: product, userLikes: result[1],
            more: result[2], similar: result[3],
            tags: result[4],
            reviews: result[5]
        });
      });
    });
};


exports.create = function (req, res) {
  var idWork = parseInt(req.body.idWork, 10)
  var promises = [
    global.db.Work.findById(idWork),
    global.db.Product.create(req.body)
  ];
  global.db.Sequelize.Promise.all(promises).then(function (result) {
    var work = result[0], product = result[1];
    promises = [
      work.updateAttributes({onSale:true}),
      product.setWork(work),
      product.setUser(req.user)
    ]
    global.db.Sequelize.Promise.all(promises).then(function (result) {
      if (req.xhr)
          return res.ok({product: product}, 'Producto creada');

      req.flash('successMessage', 'Producto Creado');
      return res.redirect('back');
    });
  });
};


exports.createReview = function (req, res) {
  req.body.ProductId = parseInt(req.body.idProduct, 10);
  req.body.UserId = parseInt(req.viewer, 10);
  global.db.Review.create(req.body).then(function(review) {
    var query = {where:{id: review.id}, include:[global.db.User]};
    global.db.Review.find(query).then(function(final){
      return res.ok({review: final}, 'Review creado');
    });
  });
};


exports.deleteReview = function (req, res) {
  global.db.Review.findById(req.body.idReview).then(function(review){
    review.destroy().then(function(){
      return res.ok({review: review}, 'Review eliminado');
    });
  });
};

exports.updateReview = function (req, res) {
  global.db.Review.findById(req.body.idReview).then(function(review){
    review.updateAttributes(req.body).then(function(){
      return res.ok({review: review}, 'Review updated');
    });
  });
};

exports.featured = function (req, res) {
    req.product.updateAttributes({featured: true}).then(function () {
        return res.ok({product: req.product}, 'Product featured');
    });
};

exports.unFeatured = function (req, res) {
    req.product.updateAttributes({featured: false}).then(function () {
        return res.ok({product: req.product}, 'Product unFeatured');
    });
};

exports.like = function (req, res) {
    req.product.like(req.user).then(function (likes) {
        return res.ok({product: req.product, likes: likes}, 'Product liked');
    });
};

exports.unLike = function (req, res) {
    req.product.unLike(req.user).then(function (likes) {
        return res.ok({product: req.product, likes: likes}, 'Product unLiked');
    });
};

exports.addToCollection = function (req, res) {
    var collections = req.body.collections;
    var query = {viewer: req.viewer, collections: collections};
    req.product.addToCollection(query).then(function (data) {
        return res.ok({collection: collections}, 'Product added to collections , this is a magic mdf :]');
    });
}


exports.removeFromCart = function (req, res) {

}
