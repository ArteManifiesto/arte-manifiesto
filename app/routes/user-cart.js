var express = require('express');
var router = express.Router();
router.mergeParams = true;

var controller = require(global.cf.controllers + "/user-cart");

router.get('/', controller.index);

router.post('/list', controller.list);

router.post('/add', controller.add);
router.post('/remove', controller.remove);

router.post('/items', controller.items);

module.exports = router;
