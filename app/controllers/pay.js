var db = require('../../config/sequelize');

exports.trial = function (req, res) {
    req.user.getPurchases({where: {type: 0}}).then(function (purchases) {
        if (purchases.length > 0) {
            var lastPurchase = purchases[purchases.length - 1];
            if (lastPurchase.isActive)
                return res.redirect('/dashboard');
        } else {
            db.Purchase.create({
                type: 0
            }).then(function (purchase) {
                req.user.addPurchase(purchase).then(function () {
                    return res.redirect('/dashboard');
                });
            })
        }
    });
};

exports.expired = function (req, res) {
    return res.render('pay/expired');
};