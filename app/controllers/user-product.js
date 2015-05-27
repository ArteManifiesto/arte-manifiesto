var basePath = 'user/product/';

exports.index = function (req, res) {
    req.product.views += 1;
    var promises = [
        req.product.save(),
        req.product.userLikes(),
        req.product.more(),
        req.product.similar(req.viewer)
    ];
    global.db.Sequelize.Promise.all(promises).then(function (result) {
        return res.render(basePath + 'index', {
            profile: req.profile,
            product: req.product, userLikes: result[1],
            more: result[2], similar: result[3]
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
    var idCollections = req.body.idCollections;
    console.log(idCollections);
    var queryCollections = {
        where: {id: {$in: idCollections}},
        appendProduct: true, idProduct: req.product.id
    };
    req.user.getCollections(queryCollections).then(function (collections) {
        return res.ok({collections: collections}, 'Product added to collections');
    });
}

exports.addToCart = function (req, res) {
    var query = {where: {ProductId: req.product.id}};
    global.db.ProductCart.find(query).then(function (productCart) {
        if (productCart) {

        }
        req.user.addProductCart(req.product).then(function () {
            return res.json('ggpe :v');
        });
    });


}