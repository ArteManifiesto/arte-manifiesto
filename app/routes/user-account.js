var express = require('express');
var router = express.Router();
router.mergeParams = true;

var controller = require(global.cf.controllers + "/user-account");

router.get('/', controller.index);
router.get('/photo', controller.photo);
router.get('/addresses', controller.addresses);
router.get('/websites', controller.websites);
router.get('/password', controller.password);

router.post('/', controller.update);
router.post('/photo', controller.photoUpdate);
router.post('/address/add', controller.addressAdd);
router.post('/address/update', controller.addressUpdate);
router.post('/websites', controller.wesitesUpdate);
router.post('/password', controller.passwordUpdate);

module.exports = router;