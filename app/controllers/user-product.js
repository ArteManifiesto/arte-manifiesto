var basePath = 'user/product/';
var _ = require('lodash');

exports.index = function (req, res) {
    console.log(req.user);

    var promises = [
        req.product.buildParts(req),
        req.product.userLikes(),
        req.product.more(),
        req.product.similar(req)
    ]
    global.db.Sequelize.Promise.all(promises).then(function (result) {
        var product = result[0], userLikes = result[1], more = result[2],
            similar = result[3];
        return res.json({
            product: product,
            userLikes: userLikes,
            more: more,
            similar: similar
        })
    });

    /*req.product.buildParts(req.viewer).then(function (product) {
     return res.render(basePath + 'index', {product: product});
     });
     */
    /*var options = {viewer: req.viewer, name: req.params.name};
     var getProduct = global.getProduct(options);
     global.db.sequelize.query(getProduct, {nest: true, raw: true}).then(function (data) {
     var product = data[0];
     var otherProducts = {
     attributes: ['id', 'name', 'nameSlugify', 'photo'],
     where: {UserId: req.profile.id, id: {not: [product.id]}},
     limit: 6,
     order: [global.db.sequelize.fn('RAND', '')]
     };
     global.db.Product.findAll(otherProducts).then(function (otherProducts) {
     var product = data[0];
     options = {product: product.id, limit: 50};
     var getLikesProduct = global.getUserLikesProduct(options);
     global.db.sequelize.query(getLikesProduct, {nest: true, raw: true}).then(function (data) {
     product.userLikes = data;
     product.otherProducts = otherProducts;
     return res.render(basePath + 'index', {
     product: product
     });
     });
     });
     });*/
};

exports.add = function (req, res) {
    return res.render(basePath + 'add');
};


exports.edit = function (req, res) {

}

exports.checkout = function (req, res) {

}


exports.create = function (req, res) {
};

exports.delete = function (req, res) {

};

exports.update = function (req, res) {

};

exports.public = function (req, res) {

};

exports.private = function (req, res) {

};

exports.featured = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        product.updateAttributes({featured: true}).then(function () {
            return res.ok({product: req.product}, 'Product featured');
        });
    });
};

exports.unFeatured = function (req, res) {
    req.product.updateAttributes({featured: false}).then(function () {
        return res.ok({product: req.product}, 'Product unFeatured');
    });
};

exports.like = function (req, res) {
    req.product.like(req.user).then(function (likes) {
        return res.ok({product: req.product, likes: likes.likes}, 'Product liked');
    });
};

exports.unLike = function (req, res) {
    req.product.unLike(req.user).then(function (likes) {
        return res.ok({product: req.product, likes: likes.likes}, 'Product unLiked');
    });
};