var express = require('express');
var router = express.Router();
router.mergeParams = true;

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user-work");

router.use(function (req, res, next) {
	var query;
	if(req.body.idWork)
		query = {where:{id:req.body.idWork}};

	if(req.params.nameWork)
		query = {where:{nameSlugify:req.params.nameWork}};
	
	if(query === undefined)
		return next();

	global.db.Work.find(query).then(function(work){
		if(!work){
			if(req.xhr)
				return res.badRequest('Work not exists');

			req.flash('errorMessage', 'Work not exists');
            return res.redirect('back');
		}
		req.work = work;
		next();
	});
});

router.get('/add', controller.add);
router.get('/:nameWork', controller.work);

router.post('/create', controller.create);
router.post('/delete', controller.workDelete);
router.post('/update', controller.workUpdate);

//TODO add middleware for check if work exists
router.post('/featured', controller.featured);
router.post('/unfeatured', controller.unFeatured);
router.post('/like', controller.like);
router.post('/unlike', controller.unLike);

router.post('/public' , controller.public);
router.post('/private' , controller.private);

/*
 router.post('/work/add/collection', controller.workAddCollection);
 router.post('/work/switch/collection', controller.workSwitchCollection);
 */

module.exports = router;