var express = require('express');
var router = express.Router({
  mergeParams: true
});

var controller = require(global.cf.controllers + "/tv-chapter");

var entity = 'Chapter';

router.use(global.md.entity(entity));

router.get('/:nameSlugify', global.md.nameSlugify(entity), controller.chapter);
router.get('/:nameSlugify/edit', global.md.isAdmin, global.md.nameSlugify(entity), controller.edit);

router.post('/review/create', global.md.isLogged, controller.review);

router.post('/publish', global.md.isAdmin, controller.publish);
router.post('/unpublish', global.md.isAdmin, controller.unPublish);

router.post('/addCompetitor', global.md.isLogged, controller.addCompetitor);

router.post('/delete', global.md.isAdmin, controller.delete);
router.post('/create', global.md.isAdmin, controller.create);
router.post('/update', global.md.isAdmin, controller.update);


module.exports = router;