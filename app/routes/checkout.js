var express = require('express');
var router = express.Router();
router.mergeParams = true;

var controller = require(global.cf.controllers + "/checkout");

router.get(['/', '/shipping'], controller.shipping);
router.get('/payment', controller.payment);
router.get('/review', controller.review);
router.get('/complete', controller.complete);

module.exports = router;
