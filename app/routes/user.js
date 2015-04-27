var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');

var controller = require(config.controllersDir + "/user");

router.use(function (req, res, next) {
    if (req.user && req.user.username == req.params.username) {
        req.profile = req.user;
        req.viewer = req.user.id;
        req.owner = true;
        return next();
    }
    global.db.User.find({where: {username: req.params.username}}).then(function (user) {
        if (!user)
            return res.redirect('/');
        req.profile = user;
        req.viewer = req.user ? req.user.id : 0;
        req.owner = false;
        return next();
    });
});

router.get('/', controller.profilePage);

router.get('/likes', controller.profilePage);
router.get('/store', controller.profilePage);

router.post('/collections/works', controller.profilePage);
router.post('/collections/products', controller.profilePage);

router.get('/followers', controller.profilePage);
router.get('/followings', controller.profilePage);

router.post('/:page', controller.portfolio);
router.post('/likes/:page', controller.likes);
router.post('/store/:page', controller.store);

router.post('/collections/works/:page', controller.collectionsWorks);
router.post('/collections/products/:page', controller.collectionsProducts);

router.post('/followers/:page', controller.followers);
router.post('/followings/:page', controller.followings);
//router.get('/:username/work/create', controller.workCreateView);

router.post('/update', controller.update);

router.post('/collection/create', controller.collectionCreate);
router.post('/collection/read', controller.collectionRead);
router.post('/collection/update', controller.collectionUpdate);
router.post('/collection/delete', controller.collectionDelete);

router.post('/collection/reorder', controller.collectionReOrder);

router.post('/work/create', controller.workCreate);
router.post('/work/delete', controller.workDelete);
router.post('/work/update', controller.workUpdate);

router.post('/work/add/collection', controller.workAddCollection);
router.post('/work/switch/collection', controller.workSwitchCollection);

router.post('/work/featured', controller.workFeatured);
router.post('/work/unfeatured', controller.workUnFeatured);

router.post('/featured', controller.userFeatured);
router.post('/unfeatured', controller.userUnFeatured);

router.post('/follow', controller.follow);
router.post('/unfollow', controller.unfollow);
router.post('/like', controller.like);
router.post('/unlike', controller.unlike);

router.get('/work/:nameWork', controller.work);

module.exports = router;