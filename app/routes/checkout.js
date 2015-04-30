var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/checkout");

router.get('/cart');
router.get('/shipping');
router.get('/payment');
router.get('/review');

module.exports = router;