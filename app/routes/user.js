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

router.get(['/', '/portfolio'], controller.profile.bind(this, 'portfolio'));
router.get('/store', controller.profile.bind(this, 'store'));
router.get('/collections', controller.profile.bind(this, 'collections'));
router.get('/followers', controller.profile.bind(this, 'followers'));
router.get('/followings', controller.profile.bind(this, 'followings'));

router.use('/work', workRouter);
router.use('/product', productRouter);
router.use('/collection', collectionRouter);
router.use('/account', isLoggedAndOwner, accountRouter);
router.use('/cart', isLoggedAndOwner, cartRouter);

router.post('/isFollowing', isLoggedAndOwner, global.md.userTo, controller.isFollowing);
router.post('/follow', isLoggedAndOwner, global.md.userTo, controller.follow);
router.post('/unfollow', isLoggedAndOwner, global.md.userTo, controller.unFollow);
router.post('/featured', global.md.isAdmin, global.md.userTo, controller.featured);
router.post('/unfeatured', global.md.isAdmin, global.md.userTo, controller.unFeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/store/:page', controller.store);
router.post('/likes/works/:page', controller.likesWorks);
router.post('/likes/products/:page', controller.likesProducts);
router.post('/collections/:page', controller.collections);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

module.exports = router;
