var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/:username', controller.profile);
router.get('/:username/configuration', controller.configuration);

router.get('/:username/work/create', controller.workCreateView);

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