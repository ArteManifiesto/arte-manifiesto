var basePath = 'blog/';

exports.index = function(req,res) {
  global.db.Post.findAll().then(function(posts){
    return res.render(basePath + 'index', {
      posts:posts
    });
  });
};


exports.post = function(req,res) {
  global.db.Post.findById(req.params.id).then(function(post){
    return res.render(basePath + 'post', {
      post:post
    });
  });
};


exports.add = function(req,res) {
  return res.render(basePath + 'add', {
    cloudinary: global.cl,
    cloudinayCors: global.cl_cors
  });
};

exports.create = function(req, res) {
  global.db.Post.create(req.body).then(function(post){
    res.ok({post:post} , 'post added');
    // post.setUser(req.user).then(function(){
    // })
  });
}
