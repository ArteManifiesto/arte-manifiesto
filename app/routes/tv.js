var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/tv");

router.get('/', controller.index);

router.get('/chapter', controller.chapter);

module.exports = router;