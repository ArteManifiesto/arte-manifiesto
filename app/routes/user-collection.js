var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-work");

router.get('/add', controller.add);
router.get('/:nameWork', controller.work);

router.post('/create', controller.create);
router.post('/delete', controller.workDelete);
router.post('/update', controller.workUpdate);

//TODO add middleware for check if work exists
router.post('/featured', controller.featured);
router.post('/unfeatured', controller.unFeatured);

router.post('/public', controller.public);
router.post('/private', controller.private);

/*
 router.post('/work/add/collection', controller.workAddCollection);
 router.post('/work/switch/collection', controller.workSwitchCollection);
 */

module.exports = router;