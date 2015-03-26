var express = require('express');
var router = express.Router();

var config = require('../../config/config');
var controller = require(config.controllersDir + "/admin");
var middlewares = require(config.middlewaresDir + '/app');

router.get('/', controller.index);

router.get('/user/:idUser/add', controller.addAdmin);
router.get('/user/:idUser/remove', controller.removeAdmin);

router.get('/users', controller.users);
router.get('/users/:idUser/activate/:idPlan', controller.userActivate);
router.get('/users/:idUser/desactivate', controller.userDesactivate);

router.get('/meals', controller.meals);
router.post('/meals/create', controller.mealCreate);

router.get('/ingredients', controller.ingredients);
router.post('/ingredients/create', controller.ingredientCreate);

router.get('/tips', controller.tips);
router.post('/tips/create', controller.tipCreate);
router.get('/tips/:idTip/delete', controller.tipDelete);

router.get('/subscribers', controller.subscribers);

router.get('/nutritionists', controller.nutritionists);
router.post('/nutritionists/create', controller.nutritionistCreate);
router.get('/nutritionists/:idNutritionist/delete', controller.nutritionistDelete);

module.exports = router;