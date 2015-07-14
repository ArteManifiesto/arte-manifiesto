var basePath = 'user/checkout/';

exports.shipping = function (req, res) {
    req.user.getAddresses().then(function (addresses) {
        return res.render(basePath + 'shipping', {
            addresses: addresses
        });
    });
};

exports.payment = function (req, res) {
    return res.render(basePath + 'payment');
};

exports.confirm = function (req, res) {
    
};

exports.review = function (req, res) {
    return res.render(basePath + 'review');
};

exports.complete = function (req, res) {
    return res.render(basePath + 'complete');
};