var basePath = 'blog/';
var fabric = require('fabric').fabric;


exports.index = function(req,res) {
  global.db.Post.findAll().then(function(posts){
    return res.render(basePath + 'index', {
      posts:posts
    });
  });
};


exports.canvas = function(req, res) {
  var canvas = fabric.createCanvasForNode(req.body.width, req.body.height);
  canvas.loadFromJSON(req.body.json, function() {
          canvas.renderAll();
          console.log('> Getting PNG data ... (this can take a while)');
          var dataUrl = canvas.toDataURLWithMultiplier('png', req.body.multiplier),
              data = dataUrl.replace(/^data:image\/png;base64,/, '');

          console.log('> Saving PNG to file ...');
          var out = fs.createWriteStream(__dirname + '/customfont.png');
var stream = canvas.createPNGStream();
stream.on('data', function(chunk) {
    out.write(chunk);
});
      });
}

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
