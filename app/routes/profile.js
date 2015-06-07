var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/profile");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/', middlewares.shouldLogged, controller.index);

module.exports = router;