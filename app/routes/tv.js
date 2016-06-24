var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/tv");

router.get('/', controller.index);

module.exports = router;