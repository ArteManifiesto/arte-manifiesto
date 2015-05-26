var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-account");

router.get('/', controller.index);
router.get('/photo', controller.photo);
//router.get('/orders', controller.orders);
router.get('/addresses', controller.addresses);
//router.get('/cards', controller.cards);
router.get('/websites', controller.websites);
router.get('/password', controller.password);

router.post('/', controller.update);

module.exports = router;