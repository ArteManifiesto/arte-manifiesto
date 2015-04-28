var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');

var controller = require(config.controllersDir + "/user");
var workRouter = require(config.routesDir + "/user-work");

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

router.get(['/', '/portfolio'], controller.profile);
router.get('/likes', controller.profile);
router.get('/products', controller.profile);

router.get('/collections/works', controller.profile);
router.get('/collections/products', controller.profile);

router.get('/followers', controller.profile);
router.get('/followings', controller.profile);

router.use('/work', workRouter);

router.post('/follow', controller.follow);
router.post('/unfollow', controller.unfollow);
router.post('/featured', controller.featured);
router.post('/unfeatured', controller.unfeatured);

router.post(['/:page', '/portfolio/:page'], controller.portfolio);
router.post('/likes/:page', controller.likes);
router.post('/products/:page', controller.products);
router.post('/collections/works/:page', controller.collectionsWorks);
router.post('/collections/products/:page', controller.collectionsProducts);
router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);

/*
 router.use('/collection/', collectionRouter);
 router.use('/product/', productRouter);
 */

/*
 router.post('/update', controller.update);
 router.post('/collection/create', controller.collectionCreate);
 router.post('/collection/read', controller.collectionRead);
 router.post('/collection/update', controller.collectionUpdate);
 router.post('/collection/delete', controller.collectionDelete);
 router.post('/collection/reorder', controller.collectionReOrder);
 router.post('/featured', controller.userFeatured);
 router.post('/unfeatured', controller.userUnFeatured);
 */

module.exports = router;