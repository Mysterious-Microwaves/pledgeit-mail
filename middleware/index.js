
var Bluebird = require('bluebird');

module.exports.Bluebird = Bluebird;

var red = require('redis');

module.exports.redis = Bluebird.promisifyAll(red);

module.exports.Q = require('./Queue');

module.exports.Mail = require('./Mail');

module.exports.bodyParser = require('body-parser');

module.exports.cron = require('node-cron');

