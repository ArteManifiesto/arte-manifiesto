var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/pages");

router.get('/', controller.index);
router.get('/success', controller.success);
router.get('/failed', controller.failed);

router.get('/compra-y-vende-arte-en-internet-latinoamerica', controller.landing);

router.get('/editor', global.md.isAdmin, controller.editor);

router.get('/feed', global.md.isLogged, controller.feedPage);
router.post('/feed/:page', global.md.isLogged, controller.feed);

router.get('/collections/category/:value/:page', controller.collections);
router.get('/works/category/:value/:page', controller.works);

router.get('/products/category/:value/:page', controller.products);
router.get('/users/specialty/:value/:page', controller.users);

router.post('/collections/category/:value/:page', controller.search.bind(null, 'collections'));
router.post('/works/category/:value/:page', controller.search.bind(null, 'works'));
router.post('/products/category/:value/:page', controller.search.bind(null, 'products'));
router.post('/users/specialty/:value/:page', controller.search.bind(null, 'users'));

router.post('/subscribe', controller.subscribe);

module.exports = router;