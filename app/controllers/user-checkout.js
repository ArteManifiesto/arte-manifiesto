var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');

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
        return res.json(products);
    });
};

exports.cartAdd = function (req, res) {
    //req.user.getProductCart
}

exports.buyer = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        global.db.Buyer.create(req.body).then(function (buyer) {
            product.addBuyer(buyer).then(function () {
                return res.ok({buyer: buyer}, 'New buyer');
            })
        });
    });

};