var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/pages");

router.get('/bth', controller.bth);
router.get('/', controller.index);
router.get('/success', controller.success);
router.get('/failed', controller.failed);
router.get('/pp', controller.pp);

router.get('/compra-y-vende-arte-en-internet-latinoamerica', controller.landing);
router.get('/featured', controller.featured);

router.get('/artjam', controller.artjam);

router.get('/sell', global.md.isLogged, controller.sell);

router.get('/amlab', controller.labredirect);
router.get('/laboratorio_de_impresion_digital_giclee_arte_y_fotografia', controller.lab);

router.get('/market', controller.marketredirect);

router.get('/editor', global.md.isAdmin, controller.editor);

router.get('/feed', global.md.isLogged, controller.feedPage);
router.post('/feed/:page', global.md.isLogged, controller.feed);

router.post('/ad/click', controller.adClick);

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