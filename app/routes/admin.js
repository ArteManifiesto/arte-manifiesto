var express = require('express');
var router = express.Router();
var controller = require(global.cf.controllers + "/admin");

router.get('/' , controller.index);

module.exports = router;