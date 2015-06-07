var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/pay");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/trial', middlewares.shouldLogged, middlewares.hasEvaluation, controller.trial);
router.get('/expired', middlewares.shouldLogged, controller.expired);

module.exports = router;