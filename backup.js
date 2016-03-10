require('dotenv').load();

global.cf = require('./config/config');
global.db = require('./config/sequelize');

global.cl = require('cloudinary').v2;
global.cl.config(process.env.CLOUDINARY_URL);
global.cl_cors = '/cloudinary_cors.html';

global.db.sequelize.sync({force: false}).then(function () {
  var getwork = function() {
    var query = {
      where: {backed: false},
      limit: 1,
      order: [global.db.sequelize.fn('RAND')]
    };
    global.db.Work.find(query).then(function(work) {
      var oldPhoto = work.photo;

      if(!work) {
        return console.log('acabo :P');
      }

      global.cl.uploader.upload(work.photo, {
        upload_preset: 'ineeb7zs'
      }).then(function(photo) {
        work.width = photo.width;
        work.height = photo.height;
        var url = photo.url;
        var privateIndex = url.indexOf('private');
        var str = url.substring(privateIndex, url.length);
        var version = str.split('/')[1];
        url = url.replace(version + '/', '');
        work.photo = url;
        work.oldPhoto = oldPhoto;
        work.backed = true;
        work.save().then(function() {
          console.log(work.id);
          console.log(oldPhoto);
          console.log(work.photo);
          console.log(photo);
          getwork();
        });
      });
    });
  }
  getwork();
});
