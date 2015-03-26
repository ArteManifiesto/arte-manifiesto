var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/evaluation");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/', controller.index);
router.post('/create', middlewares.shouldLogged, controller.create);
router.get('/result', middlewares.shouldLogged, middlewares.hasEvaluation, controller.result);
router.get('/retake', middlewares.shouldLogged, middlewares.hasEvaluation, controller.retake);

module.exports = router;