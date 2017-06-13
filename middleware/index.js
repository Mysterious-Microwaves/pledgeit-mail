// module.exports.auth = require('./auth');
// module.exports.passport = require('./passport');
// module.exports.morgan = require('morgan');
// module.exports.flash = require('connect-flash');
// module.exports.cookieParser = require('cookie-parser');
// var Path = require('path');

var Bluebird = require('bluebird');

module.exports.Bluebird = Bluebird;

module.exports.redis = Bluebird.promisifyAll(require('redis'));

module.exports.Q = require('./Queue');

module.exports.Mail = require('./Mail');

module.exports.bodyParser = require('body-parser');

module.exports.cron = require('node-cron');

