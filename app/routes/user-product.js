var express = require('express');
var router = express.Router({mergeParams: true});
var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-product");
var middlewares = require(config.middlewaresDir + "/app");

var isLoggedAndOwner = [middlewares.isLogged, middlewares.isOwner];
var entity = 'Product';

router.use(middlewares.entity(entity));

router.get('/:nameSlugify', middlewares.nameSlugify(entity), controller.index);

router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);
router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);

router.post('/addToCollection', isLoggedAndOwner, controller.addToCollection);

module.exports = router;