var basePath = 'blog/';

exports.index = function (req, res) {
  return res.ok({edu:1} , 'Hi! Blog');
};
