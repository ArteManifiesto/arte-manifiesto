var _ = require('lodash');

module.exports = _.assign(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/env.js') || {}
);
