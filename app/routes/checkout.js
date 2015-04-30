var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");

var accountRouter = require(config.routesDir + "/user-account");
var workRouter = require(config.routesDir + "/user-work");
var productRouter = require(config.routesDir + "/user-product");
var collectionRouter = require(config.routesDir + "/user-collection");

router.use(function (req, res, next) {
    if (req.user && req.user.username == req.params.username) {
        req.profile = req.user;
        req.viewer = req.user.id;
        req.owner = true;
        return next();
    }
    var query = {where: {username: req.params.username}};
    global.db.User.find(query).then(function (user) {
        if (!user)
            return res.redirect('/auth/login');
        req.profile = user;
        req.viewer = req.user ? req.user.id : 0;
        req.owner = false;
        return next();
    });
});

router.get('/')
module.exports = router;