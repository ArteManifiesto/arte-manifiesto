var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-product");

router.get('/add', controller.add);

router.post('/create', controller.create);
router.post('/delete', controller.delete);
router.post('/update', controller.update);

//TODO add middleware for check if work exists
router.post('/featured', controller.featured);
router.post('/unfeatured', controller.unFeatured);

router.post('/like', controller.like);
router.post('/unlike', controller.unLike);

router.get('/:nameProduct', controller.product);

/*
 router.post('/work/add/collection', controller.workAddCollection);
 router.post('/work/switch/collection', controller.workSwitchCollection);
 */

module.exports = router;