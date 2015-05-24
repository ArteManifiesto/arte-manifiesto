var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-collection");

router.get('/add', controller.index)

/*
 router.post('/work/add/collection', controller.workAddCollection);
 router.post('/work/switch/collection', controller.workSwitchCollection);
 */

module.exports = router;