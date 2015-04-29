var basePath = 'account/';
var redirectPath = '/' + basePath;



exports.add = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.product = function (req, res) {
    return res.json({lel: 10});
};


exports.create = function (req, res) {
};

exports.delete = function (req, res) {

};

exports.update = function (req, res) {

};

exports.like = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.like(req.user).then(function (likes) {
            return res.ok(likes, 'User liked');
        });
    })
};

exports.unLike = function (req, res) {
    global.db.Work.find(req.body.idWork).then(function (work) {
        work.unLike(req.user).then(function (likes) {
            return res.ok(likes, 'User unLiked');
        });
    });
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