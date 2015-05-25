var express = require('express');
var router = express.Router({mergeParams: true});
var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-work");
var middlewares = require(config.middlewaresDir + "/app");

var isLoggedAndOwner = [middlewares.isLogged, middlewares.isOwner];
var entity = 'Work';

router.use(middlewares.entity(entity));

router.get('/add', isLoggedAndOwner, controller.add);

router.get('/:nameSlugify', middlewares.nameSlugify(entity), controller.index);
router.get('/:nameSlugify/edit', isLoggedAndOwner, middlewares.nameSlugify(entity), controller.edit);

router.post('/create', isLoggedAndOwner, controller.create);
router.post('/delete', isLoggedAndOwner, controller.delete);
router.post('/update', isLoggedAndOwner, controller.update);

router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);
router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);

router.post('/public', isLoggedAndOwner, controller.public);
router.post('/private', isLoggedAndOwner, controller.private);

module.exports = router;