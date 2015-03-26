var moment = require('moment');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./../../config/config');
var db = require('./../../config/sequelize');

var checkUserPurchase = function () {
    var promises = [];
    db.Purchase.findAll({where: {isActive: true}}).then(function (purchases) {
        var i, purchase;
        for (i = 0; i < purchases.length; i++) {
            purchase = purchases[i];
            if (moment(purchase.endAt).diff(moment(), 'days') <= 0) {
                purchase.isActive = false;
                promises.push(purchase.save())
            }
        }
        db.Sequelize.Promise.all(promises).then(function () {
            process.exit();
        })
    });
};

checkUserPurchase();