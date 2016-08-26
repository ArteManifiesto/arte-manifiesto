require('dotenv').load();

var express = require('express');

/**
 * Setup global basic configuration
 * ====================================================
 */
global._ = require('lodash');
global.utils = require('./config/utils');

global.cf = require('./config/config');
global.lg = require('./config/languages/es');
global.md = require('./config/middlewares');
global.db = require('./config/sequelize');

global.cl = require('cloudinary').v2;
global.cl.config(process.env.CLOUDINARY_URL);
global.cl_cors = '/cloudinary_cors.html';

/**
 * Setup server configuration and sessions
 * ====================================================
 */
var passport = require('./config/passport');
var app = express();

require('json-response');
require('./config/express')(app, passport);
require('./config/routes').init(app);
require('./config/errors')(app);

app.set('port', process.env.PORT || cf.port);

global.db.sequelize.sync({force: false}).then(function () {
	// var promises = [
	// 	global.db.AdType.create({name: 'horizontal', width: 600, height: 400}),
	// 	global.db.AdType.create({name: 'vertical', width: 200, height: 400}),
	// 	global.db.AdType.create({name: 'quad', width: 400, height: 400}),

	// 	global.db.AdPackType.create({name: 'minmal', price: 300}),
	// 	global.db.AdPackType.create({name: 'premium', price: 500})
	// ];
	// global.db.sequelize.Promise.all(promises).then(function(result) {
	// 	var adType1 = result[0], adType2 = result[1], adType3 = result[2];
	// 	var packType1 = result[3], packType2 = result[4];
	// 	promises = [
	// 		packType1.setTypes([adType1, adType2]),
	// 		packType2.setTypes([adType1, adType2, adType3]),
	// 	];
	// 	global.db.sequelize.Promise.all(promises).then(function() {
	// 	});
	// });

	// global.db.Brand.create({name: 'cat'}).then(function(brand) {
	// 	

	// 	global.db.sequelize.Promise.all(promises).then(function(result) {
	// 		var adType1 = result[0], adType2 = result[1], adType3 = result[2];
	// 		var packType1 = result[3], packType2 = result[4];

	// 		packType1.setTypes([adType1, adType2]).then(function() {
	// 			global.db.AdPack.create({
	// 				name: 'campaña navidad',
	// 				startDate: new Date(),
	// 				endDate: new Date(),
	// 				isActive: true
	// 			}).then(function(adPack) {
	// 				promises = [
	// 					adPack.setAdPackType(packType1),
	// 					adPack.setBrand(brand)
	// 				];
	// 				global.db.sequelize.Promise.all(promises).then(function(result) {
	// 					brand.getAdPacks({where:{isActive: true}, limit: 1, 
	// 						include:[{
	// 							model: global.db.AdPackType,
	// 							include: [{
	// 								model: global.db.AdType,
	// 								as: 'Types'
	// 							}]
	// 						}]
	// 					}).then(function(adPacks) {
	// 						var adPack = adPacks[0];
	// 						var promises = [];
	// 						global._.map(adPack.AdPackType.Types, function(adType) {
	// 							promises.push(global.db.Ad.create({
	// 								AdPackId: adPack.id,
	// 								BrandId: brand.id, 
	// 								AdTypeId: adType.id
	// 							}));
	// 						});
	// 						global.db.sequelize.Promise.all(promises).then(function(result) {
	// 							global.db.Brand.find({
	// 								where:{
	// 									id: brand.id
	// 								},
	// 								include: [{
	// 									model: global.db.AdPack,
	// 									where: {isActive: true},
	// 									include: [{
	// 										model: global.db.Ad,
	// 										include: [{
	// 											model: global.db.AdType,
	// 											where: {name: 'horizontal'}
	// 										}]
	// 									}]
	// 								}]
	// 							}).then(function(d) {
	// 								console.log(d.AdPacks[0].toJSON());
	// 							});

	// 							// brand.getAds({include:[{
	// 							// 	model: global.db.AdType,
	// 							// 	where: {}
	// 							// }]})
	// 							// result[0].getBrand().then(function(val) {
	// 							// 	result[0].getAdType().then(function(adType) {
	// 							// 		console.log(adType.toJSON());
	// 							// 	});
	// 							// })
	// 						});
	// 					});

	// 					// global.db.Brand.findById(brand.id).then(function(newBrand) {
	// 					// 	newBrand.
	// 					// 	// newBrand.id
	// 					// });
	// 				});
	// 			});
	// 		});
	// 	});


	// 	// global.db.AdType.create({
	// 	// 	name: 'quad',
	// 	// 	width: 300,
	// 	// 	height: 400
	// 	// }).then(function(adType) {
	// 	// 	global.db.AdPackType.create({
	// 	// 		name: 'premium',
	// 	// 		price: 500
	// 	// 	}).then(function(adPackType) {

	// 	// 	});

	// 	// 	adPackType.setAdPackTypeAdTypes([adType]).then(function() {
	// 	// 			global.db.AdPack.create({
	// 	// 				name: 'campaña navidad',
	// 	// 				startDate: new Date(),
	// 	// 				endDate: new Date(),
	// 	// 				isActive: true
	// 	// 			}).then(function(adPack) {
	// 	// 				adPack.setAdPackType(adPackType);
	// 	// 			});
	// 	// 		});
	// 	// });
	// });
});

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening  on http://127.0.0.1:' + app.get('port'));
});
exports = module.exports = server;
