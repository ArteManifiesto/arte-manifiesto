var basePath = 'user/product/';
var _ = require('lodash');

exports.index = function (req, res) {
    var promises = [
        req.product.buildParts(req),
        req.product.userLikes(),
        req.product.more(),
        req.product.similar(req)
    ]
    global.db.Sequelize.Promise.all(promises).then(function (result) {
        return res.render(basePath + 'index', {
            product: result[0], userLikes: result[1],
            more: result[2], similar: result[3]
        });
    });
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