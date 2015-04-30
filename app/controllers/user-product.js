var basePath = 'account/';
var redirectPath = '/' + basePath;


exports.add = function (req, res) {
    return res.render(basePath + 'work-create');
};

exports.product = function (req, res) {
    var query = {
        where: {
            nameSlugify: req.params.nameProduct,
            include: [
                {
                    model: global.db.Product,
                    include: [
                        {model: global.db.User, as: 'ProductLikes'},
                        {model: global.db.User, as: 'Productcollects'}
                    ]
                }
            ]
        }
    };
    global.db.Product.find(query).then(function (product) {

    });

    return res.json({lele: 20});

    return res.render('user/product/index');
    //return res.json({lel: 10});
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