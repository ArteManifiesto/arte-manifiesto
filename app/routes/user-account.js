var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-account");

router.get('/', controller.index);
router.post('/', controller.update);

module.exports = router;