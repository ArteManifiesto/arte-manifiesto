var express = require('express');
var router = express.Router({mergeParams: true});

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-collection");
var middlewares = require(config.middlewaresDir + "/app");

var isLoggedAndOwner = [middlewares.isLogged, middlewares.isOwner];
var entity = 'Collection';

router.use(middlewares.entity(entity));

router.get('/:nameSlugify', middlewares.nameSlugify(entity), controller.index);

router.post('/all', isLoggedAndOwner, controller.all);
router.post('/create', isLoggedAndOwner, controller.create);
router.post('/update', isLoggedAndOwner, controller.update);
router.post('/delete', isLoggedAndOwner, controller.delete);

router.post('/public', isLoggedAndOwner, controller.public);
router.post('/private', isLoggedAndOwner, controller.private);

module.exports = router;