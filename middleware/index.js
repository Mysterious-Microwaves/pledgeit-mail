// module.exports.auth = require('./auth');
// module.exports.passport = require('./passport');
// module.exports.morgan = require('morgan');
module.exports.bodyParser = require('body-parser');

module.exports.Q = require('./Queue');
// module.exports.flash = require('connect-flash');
// module.exports.cookieParser = require('cookie-parser');
var Bluebird = require('bluebird');

module.exports.Bluebird = Bluebird;

module.exports.redis = Bluebird.promisifyAll(require('redis'));
// var Mail = require('mailgun-js');
// var bodyParser = require('body-parser');
// var Path = require('path');
