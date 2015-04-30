var basePath = 'account/';
var redirectPath = '/' + basePath;


exports.add = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.product = function (req, res) {
    var options = {viewer: req.viewer, name: req.params.nameProduct, limit: 50};
    var query = global.getProductSingle(options);
    global.db.sequelize.query(query, {nest: true, raw: true}).then(function (data) {
        var product = data[0];
        global.db.Product.find(product.id).then(function (pro) {
            pro.getProductLikes({limit: 50}).then(function (likes) {
                return res.json({product: product, likes: likes});
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