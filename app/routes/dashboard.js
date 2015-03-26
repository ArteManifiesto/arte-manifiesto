var express = require('express');
var router = express.Router();
var config = require('../../config/config');
var controller = require(config.controllersDir + "/dashboard");

router.get('/', controller.index);

module.exports = router;