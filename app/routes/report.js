var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/report");

router.get('/', controller.index);

router.get('/users/:page', controller.users);
router.post('/users/:page', controller.search);

router.get('/works/:page', controller.works);
router.post('/works/:page', controller.search);

module.exports = router;
