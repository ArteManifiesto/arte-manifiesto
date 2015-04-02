var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/:username', controller.profile);
router.get('/:username/configuration', controller.configuration);
router.get('/:username/portfolio/upload', controller.upload);

router.post('/update', controller.update);

router.post('/portfolio/upload', controller.postUpload);

router.post('/collection/add', controller.collectionAddWork);
router.post('/collection/remove', controller.collectionRemoveWork);
router.post('/collection/switch', controller.collectionSwitchWork);


router.post('/collection/create', controller.collectionCreate);
router.post('/collection/remove', controller.collectionRemove);

router.post('/follow', controller.follow);
router.post('/unfollow', controller.unfollow);
router.post('/like', controller.like);
router.post('/unlike', controller.unlike);

module.exports = router;