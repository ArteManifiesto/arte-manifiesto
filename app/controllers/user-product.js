var basePath = 'account/';
var redirectPath = '/' + basePath;


exports.add = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.product = function (req, res) {
    var options = {viewer: req.viewer, name: req.params.nameProduct};
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
                return res.render('user/product/index', {
                    product: product
                });
            });
        });
    });
};


exports.create = function (req, res) {
};

exports.delete = function (req, res) {

};

exports.update = function (req, res) {

};


exports.featured = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        product.updateAttributes({featured: true}).then(function () {
            return res.ok('Product featured');
        });
    });
};

exports.unFeatured = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        product.updateAttributes({featured: false}).then(function () {
            return res.ok('Product unFeatured');
        });
    });
};

exports.like = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        product.like(req.user).then(function (likes) {
            return res.ok({product: product, likes: likes.likes}, 'Product liked');
        });
    })
};

exports.unLike = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        product.unLike(req.user).then(function (likes) {
            return res.ok({product: product, likes: likes.likes}, 'Product unLiked');
        });
    });
};