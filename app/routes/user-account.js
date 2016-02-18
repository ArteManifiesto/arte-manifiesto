var express = require('express');
var router = express.Router();
router.mergeParams = true;

var controller = require(global.cf.controllers + '/user-account');

router.get('/', controller.index);
router.get('/photo', controller.photo);
router.get('/password', controller.password);

router.get('/orders', controller.orders);
router.get('/requests', controller.requests);

router.get('/seller', controller.seller);
router.post('/seller', controller.sellerUpdate);

router.post('/update', controller.update);
router.post('/photo', controller.photoUpdate);
router.post('/password', controller.passwordUpdate);
router.post('/update_cover', controller.updateCover);

module.exports = router;
