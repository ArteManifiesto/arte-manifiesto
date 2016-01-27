var basePath = 'user/account/';

exports.index = function (req, res) {
  var promises = [
    global.db.Category.findAll({where:{meta: 0}}),
    req.user.getInterests()
  ];

  global.db.Sequelize.Promise.all(promises).then(function (result) {
    return res.render(basePath + 'index', {
      categories: result[0],
      interests: result[1],
      context: req.query.context,
      cloudinary_cors: global.cl_cors,
      cloudinary: global.cl
    });
  });
};

exports.update = function (req, res) {
  console.log(req.body);
  req.body.isArtist = parseInt(req.body.isArtist, 10);
  req.body.filled = true;
  req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
  var interestsData = req.body.interests || [];
  var promises = [];
  var query = {where: {id: {in: interestsData}}};
  global.db.Category.findAll(query).then(function (interests) {
    promises = [
      req.user.setInterests(interests),
      req.user.updateAttributes(req.body)
    ];
    global.db.Sequelize.Promise.all(promises).then(function () {
      return res.ok({user: req.user}, 'User updated');
    });
  });
};

//TODO make possible that the user can have multiple photos
exports.photo = function (req, res) {
  return res.render(basePath + 'photo');
};

exports.photoUpdate = function (req, res) {
  req.user.updateAttributes(req.body).then(function () {
    return res.ok({user: req.user}, 'Foto actualizada');
  });
};

exports.password = function (req, res) {
  return res.render(basePath + 'password');
};

exports.passwordUpdate = function (req, res) {
  req.user.salt = req.user.makeSalt();
  req.user.hashedPassword = req.user.encryptPassword(req.body.password, req.user.salt);
  req.user.tokenResetPassword = null;
  req.user.tokenResetPasswordExpires = null;
  req.user.save().then(function () {
    return res.ok({user: req.user}, 'Contraseña actualizada');
  });
};


exports.updateCover = function (req, res) {
  req.user.updateAttributes(req.body).then(function () {
    return res.ok({user: req.user}, 'Cover actualizado');
  });
};
