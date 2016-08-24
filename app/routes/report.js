var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/report");

router.get('/', controller.index);

router.get('/users/:page', controller.users);
router.post('/users/:page', controller.search.bind(this, 'User'));

router.get('/works/:page', controller.works);
router.post('/works/:page', controller.search.bind(this, 'Work'));

router.get('/blog/:page', controller.blog);
router.post('/blog/:page', controller.search.bind(this, 'Post'));

router.get('/brands/:idBrand/ad-creator', controller.adCreator);

router.get('/brands/:page', controller.brands);
router.post('/brands/:page', controller.search.bind(this, 'Brand'));

router.get('/banners/edit/:idBanner', controller.editBanner);
router.post('/banners/update', controller.updateBanner);

router.get('/general', controller.general);
router.get('/banners', controller.banners);

router.get('/products_applying/product/:idProduct', controller.productRevision);
router.post('/products/update', controller.updateProduct);


router.get('/products/:page', controller.products);
router.post('/products/:page', controller.search.bind(this, 'Product'));

router.get('/products_applying/:page', controller.productsApplying);
router.post('/products_applying/:page', controller.search.bind(this, 'Product'));

module.exports = router;