var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/user");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/:username', controller.profile);
router.post('/:username/update', controller.update);
router.get('/:username/configuration', controller.configuration);

router.get('/:username/portfolio/upload', controller.upload);
router.post('/:username/portfolio/upload', controller.postUpload);

//router.get('/profile', controller.profile);

//router.get('/store', controller.configuration);

router.post('/follow/:idUser', controller.follow);
router.post('/unfollow/:idUser', controller.unfollow);
router.post('/like/:idWork', controller.like);
router.post('/unlike/:idWork', controller.unlike);

module.exports = router;