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
console.log("\n\nREDCLIENTADDR",redClientAddress);

var Redis = middleware.redis.createClient({ host: redClientAddress });
// var Redis = middleware.redis.createClient( 1337, redClientAddress );

Redis.on('connect', function() {
  console.log("Redis connected!");
});

// Initialize Queue with Redis Instance
var Q = new middleware.Q(Redis);

// Q.Red.flushdb();
// Q.size().then(function(size){ console.log('STARTING WITH ',size)})

// add task to queue
app.post('/mail', function(req,res){
  /* expects { 
      auth: hash,             // required!
      to: email,              // required! 
      type: 'thanks_pledge',  // required!
      amount: amount,         // required!
      venmo: username       // optional
  } */
  var newtask = JSON.stringify(req.body);
  // console.log("ADD", newtask);
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


// WORKER
// every minute it will go through the queue 
// and execute the tasks in it

// x // DATABASE ( REDIS APPENDONLY )
// redis is persisting data automatically using appendonly true
// it saves and rebuilds automatically


// AUTHENTICATE 
// the request is coming from the verified client
// perhaps have request object come with an auth key or hash
// and compare against it


// VENMO LINKS ( in template )
// manipulate links, make them as url to btn


// default dev-mode config files,
// ignored on .gitignore