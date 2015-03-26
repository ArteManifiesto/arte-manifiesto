var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var middlewares = require(config.middlewaresDir + '/app');

router.post('/specific', controller.specific);

module.exports = router;