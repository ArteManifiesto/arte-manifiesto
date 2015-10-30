var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(global.cf.controllers + "/user");
var accountRouter = require(global.cf.routes + "/user-account");
var cartRouter = require(global.cf.routes + '/user-cart');
var workRouter = require(global.cf.routes + "/user-work");
var productRouter = require(global.cf.routes + "/user-product");
var collectionRouter = require(global.cf.routes + "/user-collection");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];

router.use(global.md.user);

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
router.use('/cart', isLoggedAndOwner, cartRouter);

router.post('/follow', isLoggedAndOwner, global.md.userTo, controller.follow);
router.post('/unfollow', isLoggedAndOwner, global.md.userTo, controller.unFollow);
router.post('/featured', isLoggedAndOwner, global.md.userTo, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, global.md.userTo, controller.unFeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/store/:page', controller.store);
router.post('/likes/works/:page', controller.likesWorks);
router.post('/likes/products/:page', controller.likesProducts);
router.post('/collections/:page', controller.collections);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

module.exports = router;
