'use strict';
var app = require('express')();
var path = require('path');
var middleware = require('./middleware');
var pledgeitUrl = 'http://pledgeit-staging.herokuapp.com';

app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser({ limit: '50mb' }));

// Redis configurated with appendonly: yes 
// for data persistence and rebuild on spin up
var redClientAddress = process.env.REDIS_URL || '127.0.0.1';
var Redis = middleware.redis.createClient({ host: redClientAddress });

Redis.on('connect', function() {
  console.log("Redis connected!");
});

// Initialize Queue with Redis Instance
var Q = new middleware.Q(Redis);

/* 
  add task to queue
  expects { 
      to: email,              // required! 
      type: 'thanks_pledge',  // required!
      amount: amount,         // required!
      venmo: username       // optional
  } 
*/

app.post('/mail', function(req,res){

  var newtask = JSON.stringify(req.body);

  Q.add( newtask ).then(function( response ){
    res.send( response );
  }); 
});

// Redirect on all other requests
app.use('*', function(req, res){
  res.redirect( pledgeitUrl );
});

// Go through all tasks every minute
var crontime = 0;
middleware.cron.schedule('*/5 * * * * *', function(){
  crontime += 5;
  console.log('[ %s ] Going through Queue every 5 seconds', crontime);
  Q.size().then(function(size){
    if ( size > 0 ){
      Q.doGroup();
    }
  });
});

module.exports = app;
