'use strict';
var middleware = require('../middleware');
var pledgeitUrl = 'http://pledgeit-staging.herokuapp.com';


// Instantiate TEST Redis
var Redis = middleware.redis.createClient(7357, '127.0.0.1');

// Instantiate Queue with TEST Redis
var Q = new middleware.Q(Redis);


var testEntryTest = JSON.stringify({ 
      to: 'oliverullman@gmail.com',
      type: 'test',
      amount: '9000',
      project: 'Saving Ollies',
      venmo: 'VenmoUserOrPhoneOrEmail'
    });

var testEntryPay = JSON.stringify({ 
      to: 'oliverullman@gmail.com',
      type: 'thanks_pledge',
      amount: '9000',
      project: 'Saving Ollies',
      venmo: 'VenmoUserOrPhoneOrEmail'
    });

// Flush test db
var flush = function(){
  Q.Red.flushdb();
};

module.exports.Redis = Redis;
module.exports.Q = Q;
module.exports.testEntry = testEntryTest;
module.exports.testEntryPay = testEntryPay;
module.exports.flush = flush;