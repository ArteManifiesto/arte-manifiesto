var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-cart");

router.get('/', controller.index);

router.post('/items' , controller.items);
router.post('/add' , controller.add);
router.post('/remove' , controller.remove);

module.exports = router;