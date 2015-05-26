var express = require('express');
var router = express.Router();
var config = require('../../config/config');
var controller = require(config.controllersDir + "/pages");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/', controller.index);

router.post('/search/:entity/:filter/:value/:page', controller.search);

router.get('/works/category/:value/:page', controller.works);
router.get('/users/specialty/:value/:page', controller.users);
router.get('/products/type/:value/:page', controller.products);

router.get('/store/:nameProduct/', controller.storeProduct);
router.get('/pay/:idProduct', controller.productPay);

router.get('/interests', middlewares.isLogged, controller.interests);
router.get('/specialties', middlewares.isLogged, middlewares.checkInterests, controller.specialties);

module.exports = router;