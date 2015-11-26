var express = require('express');
var router = express.Router();
var controller = require(global.cf.controllers + "/blog");

router.get('/', controller.index);
router.get('/add', controller.add);

module.exports = router;
