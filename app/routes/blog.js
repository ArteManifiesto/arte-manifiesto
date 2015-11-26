var express = require('express');
var router = express.Router();
var controller = require(global.cf.controllers + "/blog");

router.get('/', controller.index);
router.get('/post/:id', controller.post);
router.get('/add', controller.add);
router.post('/create', controller.create);

module.exports = router;
