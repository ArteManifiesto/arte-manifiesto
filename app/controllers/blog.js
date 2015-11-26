var basePath = 'blog/';

exports.index = function(req,res) {
  return res.render(basePath + 'index');
};

exports.add = function(req,res) {
  return res.render(basePath + 'add');
};
