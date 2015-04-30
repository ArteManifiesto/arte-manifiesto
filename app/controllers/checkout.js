var basePath = 'user/';
var redirectPath = '/' + basePath;
var Chance = require('chance');
var _ = require('lodash');
var chance = new Chance();

var async = require('async');
var cloudinary = require('cloudinary').v2;
var Promise = require('bluebird');


exports.cart = function (req, res) {
    var query = {nameSlugify: req.params.nameProduct};
    global.db.Product.find(query).then(function (product) {
        return res.render('checkout/index');
    });
};

exports.buyer = function (req, res) {
    global.db.Buyer.create(req.body).then(function (buyer) {
        return res.ok({buyer: buyer}, 'New buyer');
    });
};