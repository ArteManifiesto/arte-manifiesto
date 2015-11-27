var express = require('express');
var router = express.Router();
router.mergeParams = true;

var controller = require(global.cf.controllers + "/user");
var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];

router.use(global.md.user);

router.get(['/', '/portfolio'], controller.profile.bind(this, 'portfolio'));
router.get('/collections', controller.profile.bind(this, 'collections'));
router.get('/followers', controller.profile.bind(this, 'followers'));
router.get('/followings', controller.profile.bind(this, 'followings'));

router.get('/notifications', isLoggedAndOwner, controller.notificationsPage);
router.post('/notifications/:page', isLoggedAndOwner, controller.notifications);


router.use('/work', require(global.cf.routes + "/user-work"));
router.use('/collection', require(global.cf.routes + "/user-collection"));
router.use('/account', isLoggedAndOwner, require(global.cf.routes + "/user-account"));

router.post('/isFollowing', isLoggedAndOwner, global.md.userTo, controller.isFollowing);
router.post('/follow', isLoggedAndOwner, global.md.userTo, controller.follow);
router.post('/unfollow', isLoggedAndOwner, global.md.userTo, controller.unFollow);
router.post('/featured', global.md.isAdmin, global.md.userTo, controller.featured);
router.post('/unfeatured', global.md.isAdmin, global.md.userTo, controller.unFeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/collections/:page', controller.collections);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

module.exports = router;
