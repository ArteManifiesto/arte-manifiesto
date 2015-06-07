var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var accountRouter = require(config.routesDir + "/user-account");
var checkoutRouter = require(config.routesDir + '/user-checkout');
var workRouter = require(config.routesDir + "/user-work");
var productRouter = require(config.routesDir + "/user-product");
var collectionRouter = require(config.routesDir + "/user-collection");

var middlewares = require(config.middlewaresDir + "/app");
var isLoggedAndOwner = [middlewares.isLogged, middlewares.isOwner];

router.use(middlewares.user);

router.get(['/', '/portfolio'], controller.profile);
router.get('/likes/works', controller.profile);
router.get('/likes/products', controller.profile);
router.get('/store', controller.profile);
router.get('/collections', controller.profile);
router.get('/followers', controller.profile);
router.get('/followings', controller.profile);

router.use('/work', workRouter);
router.use('/product', productRouter);
router.use('/collection', collectionRouter);
router.use('/account', isLoggedAndOwner, accountRouter);
router.use('/checkout', isLoggedAndOwner, checkoutRouter);

router.post('/follow', isLoggedAndOwner, middlewares.userTo, controller.follow);
router.post('/unfollow', isLoggedAndOwner, middlewares.userTo, controller.unFollow);
router.post('/featured', isLoggedAndOwner, middlewares.userTo, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, middlewares.userTo, controller.unFeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/store/:page', controller.store);
router.post('/likes/works/:page', controller.likesWorks);
router.post('/likes/products/:page', controller.likesProducts);
router.post('/collections/:page', controller.collections);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

module.exports = router;