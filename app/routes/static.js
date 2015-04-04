var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/static");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/', controller.index);
router.get('/users', controller.users);
router.get('/works', controller.works);

router.get('/works/search', controller.searchWork);

//router.get('/sign_s3', controller.signS3);
module.exports = router;