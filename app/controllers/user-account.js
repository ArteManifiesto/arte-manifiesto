var basePath = 'user/account/';

exports.index = function(req, res) {
  var promises = [
    global.db.Category.findAll({
      where: {
        meta: 0
      }
    }),
    req.profile.getInterests()
  ];

  global.db.Sequelize.Promise.all(promises).then(function(result) {
    return res.render(basePath + 'index', {
      profile: req.profile,
      categories: result[0],
      interests: result[1],
      context: req.query.context,
      cloudinary_cors: global.cl_cors,
      cloudinary: global.cl
    });
  });
};

exports.configuration = function(req, res) {
  return res.render(basePath + 'configuration');
};

exports.requests = function(req, res) {
  global.db.Order.findAll({
    where: {
      SellerId: req.user.id,
    },
    include: [{
      model: global.db.User
    }, {
      model: global.db.Product
    }]
  }).then(function(requests) {
    return res.render(basePath + 'requests', {
      requests: requests
    });
  });
};

exports.orders = function(req, res) {
  global.db.Order.findAll({
    where: {
      UserId: req.user.id,
    },
    include: [{
      model: global.db.User,
      as: 'Seller'
    }, {
      model: global.db.Product
    }]
  }).then(function(orders) {
    return res.render(basePath + 'orders', {
      orders: orders
    });
  });
};

exports.deactivate = function(req, res) {
  req.user.destroy().then(function() {
    req.session.destroy(function(err) {
      return res.ok({
        user: req.user
      }, 'User deactivated');
    });
  });
};

exports.update = function(req, res) {
  req.body.fullname = req.body.firstname + ' ' + req.body.lastname;
  req.body.isArtist = parseInt(req.body.isArtist, 10);
  req.body.filled = true;
  var interestsData = req.body.interests || [];
  var promises = [];
  var query = {
    where: {
      id: { in : interestsData
      }
    }
  };
  global.db.Category.findAll(query).then(function(interests) {
    promises = [
      req.profile.setInterests(interests),
      req.profile.updateAttributes(req.body)
    ];
    global.db.Sequelize.Promise.all(promises).then(function() {
      return res.ok({
        user: req.profile
      }, 'User updated');
    });
  });
};

//TODO make possible that the user can have multiple photos
exports.photo = function(req, res) {
  return res.render(basePath + 'photo');
};

exports.photoUpdate = function(req, res) {
  req.profile.updateAttributes(req.body).then(function() {
    return res.ok({
      user: req.profile
    }, 'Foto actualizada');
  });
};

exports.password = function(req, res) {
  return res.render(basePath + 'password', {
    profile: req.profile
  });
};

exports.passwordUpdate = function(req, res) {
  req.profile.salt = req.profile.makeSalt();
  req.profile.hashedPassword = req.profile.encryptPassword(req.body.password, req.profile.salt);
  req.profile.tokenResetPassword = null;
  req.profile.tokenResetPasswordExpires = null;
  req.profile.save().then(function() {
    return res.ok({
      user: req.profile
    }, 'Contraseña actualizada');
  });
};

exports.seller = function(req, res) {
  if (req.user.country !== 'Peru') return res.redirect('/user/' + req.user.username + '/account');
  return res.render(basePath + 'seller');
};

exports.sellerUpdate = function(req, res) {
  req.body.isSeller = true;
  req.user.updateAttributes(req.body).then(function() {
    return res.ok({
      user: req.user
    }, 'Se actualizo los datos de vendedor');
  });
};

exports.unSeller = function(req, res) {
  req.user.updateAttributes({
    isSeller: false
  }).then(function() {
    return res.ok({
      user: req.user
    }, 'Se desactivo el vendedor');
  });
};


exports.updateCover = function(req, res) {
  req.profile.updateAttributes(req.body).then(function() {
    return res.ok({
      user: req.profile
    }, 'Cover actualizado');
  });
};