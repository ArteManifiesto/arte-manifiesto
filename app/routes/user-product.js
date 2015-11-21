var express = require('express');
var router = express.Router({mergeParams: true});

var controller = require(global.cf.controllers + "/user-product");

var isLoggedAndOwner = [global.md.isLogged, global.md.isOwner];
var entity = 'Product';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.index.bind(this, 'index'));
router.get('/:nameSlugify/reviews', global.md.nameSlugify(entity), controller.index.bind(this, 'reviews'));
router.get('/:nameSlugify/tags', global.md.nameSlugify(entity), controller.index.bind(this, 'tags'));
router.get('/:nameSlugify/edit', isLoggedAndOwner, global.md.nameSlugify(entity), controller.edit);
router.get('/:nameSlugify/buy', global.md.isLogged, global.md.nameSlugify(entity), controller.buy);

router.post('/create', isLoggedAndOwner, controller.create);

router.post('/review/create', isLoggedAndOwner, controller.createReview);
router.post('/review/delete', isLoggedAndOwner, controller.deleteReview);
router.post('/review/update', isLoggedAndOwner, controller.updateReview);

// router.post('/delete', isLoggedAndOwner, controller.delete);
// router.post('/update', isLoggedAndOwner, controller.update);

router.post('/like', isLoggedAndOwner, controller.like);
router.post('/unlike', isLoggedAndOwner, controller.unLike);
router.post('/featured', isLoggedAndOwner, controller.featured);
router.post('/unfeatured', isLoggedAndOwner, controller.unFeatured);

router.post('/add_to_collection', controller.addToCollection);

module.exports = router;
