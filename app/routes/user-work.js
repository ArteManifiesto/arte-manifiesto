var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');

var controller = require(config.controllersDir + "/user-work");

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