var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/checkout");

router.get('/:nameProduct', controller.cart);

module.exports = router;