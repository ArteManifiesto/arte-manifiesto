var path = require('path'),
    rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    modelsDir: rootPath + '/app/models',
    viewsDir: rootPath + '/app/views',
    controllersDir: rootPath + '/app/controllers',
    routesDir: rootPath + '/app/routes',
    publicDir: rootPath + '/public',
    middlewaresDir: rootPath + '/config/middlewares'
};