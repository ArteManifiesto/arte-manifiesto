var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + "/user-work");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var entity = 'Work';

router.use(global.md.entity(entity));

router.get('/add', isLoggedAndOwner, controller.add);

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index.bind(this, 'index'));
router.get('/:nameSlugify/reviews', global.md.nameSlugify(entity), controller.index.bind(this, 'reviews'));
router.get('/:nameSlugify/tags', global.md.nameSlugify(entity), controller.index.bind(this, 'tags'));
// router.get('/:nameSlugify/products', global.md.nameSlugify(entity), controller.index.bind(this, 'products'));

router.get('/:nameSlugify/edit', isLoggedAndOwner, global.md.nameSlugify(entity), controller.edit);
router.get('/:nameSlugify/published', isLoggedAndOwner, global.md.nameSlugify(entity), controller.published);
// router.get('/:nameSlugify/sell', isLoggedAndOwner, global.md.nameSlugify(entity), controller.sell);

router.post('/create', isLoggedAndOwner, controller.create);
router.post('/delete', global.md.isAdminOrOwner, controller.delete);
router.post('/update', isLoggedAndOwner, controller.update);

router.post('/save_manifest', controller.saveManifest);

router.post('/featured', global.md.isAdmin, controller.featured);
router.post('/unfeatured', global.md.isAdmin, controller.unFeatured);
router.post('/like', isLoggedAndOwner, controller.like);
router.post('/availability', global.md.isLogged, controller.availability);

router.post('/review/create', isLoggedAndOwner, controller.createReview);
router.post('/review/delete', isLoggedAndOwner, controller.deleteReview);
router.post('/review/update', isLoggedAndOwner, controller.updateReview);

router.post('/public', isLoggedAndOwner, controller.public);
router.post('/private', isLoggedAndOwner, controller.private);

router.post('/remove_from_collection', controller.removeFromCollection);
router.post('/add_to_collection', controller.addToCollection);
router.post('/inside_collection', controller.insideCollection);

module.exports = router;
