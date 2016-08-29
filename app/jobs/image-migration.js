require('dotenv').load();

var cl = require('cloudinary').v2;

cl.config(process.env.CLOUDINARY_URL);



// cl.uploader.explicit('rocket_p3xn3s', {type: 'private'}, function(result) {
// 	console.log(result);
// });


// cl.api.resources().then(function(result) {
// 	console.log(result);
// });