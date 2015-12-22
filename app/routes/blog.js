var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + '/blog');

router.get('/', controller.index);

module.exports = router;
