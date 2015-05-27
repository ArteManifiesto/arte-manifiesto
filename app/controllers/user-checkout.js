var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');


exports.cart = function (req, res) {
    req.user.getProductCarts().then(function (products) {
        return res.json(products);
    });
};

exports.buyer = function (req, res) {
    global.db.Product.find(req.body.idProduct).then(function (product) {
        global.db.Buyer.create(req.body).then(function (buyer) {
            product.addBuyer(buyer).then(function () {
                return res.ok({buyer: buyer}, 'New buyer');
            })
        });
    });

};