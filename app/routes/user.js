var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");

var accountRouter = require(config.routesDir + "/user-account");
var workRouter = require(config.routesDir + "/user-work");
var productRouter = require(config.routesDir + "/user-product");
var collectionRouter = require(config.routesDir + "/user-collection");

var middlewares = require(config.middlewaresDir + "/app");
var isLoggedAndOwner = [middlewares.isLogged, middlewares.isOwner];

router.use(middlewares.user);

router.get(['/', '/portfolio'], controller.profile);
router.get('/likes/works', controller.profile);
router.get('/likes/products', controller.profile);
router.get('/products', controller.profile);
router.get('/collections/works', controller.profile);
router.get('/collections/products', controller.profile);
router.get('/followers', controller.profile);
router.get('/followings', controller.profile);

router.use('/work', workRouter);
router.use('/product', productRouter);
router.use('/collection', collectionRouter);
router.use('/account', isLoggedAndOwner, accountRouter);

router.post('/follow', isLoggedAndOwner, controller.follow);
router.post('/unfollow', isLoggedAndOwner, controller.unFollow);
router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);

router.post(['/:page', '/portfolio/:page'], isLoggedAndOwner, controller.portfolio);
router.post('/likes/works/:page', isLoggedAndOwner, controller.likesWorks);
router.post('/likes/products/:page', isLoggedAndOwner, controller.likesProducts);
router.post('/products/:page', isLoggedAndOwner, controller.products);
router.post('/collections/works/:page', isLoggedAndOwner, controller.collectionsWorks);
router.post('/collections/products/:page', isLoggedAndOwner, controller.collectionsProducts);
router.post('/followers/:page', isLoggedAndOwner, controller.followers);
router.post('/followings/:page', isLoggedAndOwner, controller.followings);

module.exports = router;