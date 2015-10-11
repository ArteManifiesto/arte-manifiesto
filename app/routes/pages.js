var express = require('express');
var router = express.Router();

var controller = require(global.cf.controllers + "/pages");

router.get('/', controller.index);

//router.post('/search/:entity/:filter/:value/:page', controller.search);

router.get('/works/category/:value/:page', controller.works);
router.get('/users/specialty/:value/:page', controller.users);
router.get('/products/type/:value/:page', controller.products);

router.post('/works/category/:value/:page', controller.search.bind(null ,'works'));
router.post('/users/specialty/:value/:page', controller.search.bind(null ,'users'));
router.post('/products/type/:value/:page', controller.search.bind(null ,'products'));

module.exports = router;
