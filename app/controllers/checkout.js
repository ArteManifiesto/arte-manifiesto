var basePath = 'user/checkout/';
var redirectPath = '/' + basePath;

exports.index = function (req, res) {
    var query = {
        order: [[global.db.Product, global.db.User, 'username']],
        include: [{
            model: global.db.Product,
            include: [
                {model: global.db.User}
            ]
        }]
    };
    req.user.getProductCarts(query).then(function (products) {
        return res.render(basePath + 'cart', {
            products: products
        });
    });
};

exports.shipping = function (req, res) {
    req.user.getAddresses().then(function (addresses) {
        return res.render(basePath + 'shipping', {addresses: addresses});
    });
};

exports.payment = function (req, res) {
    return res.render(basePath + 'payment');
};

exports.review = function (req, res) {
    return res.render(basePath + 'review');
};

exports.complete = function (req, res) {
    return res.render(basePath + 'complete');
};