'use strict';
var app = require('express')();
var path = require('path');
var middleware = require('./middleware');

app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser({ limit: '50mb' }));

// Redis configurated with 'appendonly' mode yes 
// for data persistence and rebuild on suddent stop / crash
var Redis = middleware.redis.createClient(1337, '127.0.0.1');
Redis.on('connect', function() {
  console.log("Redis connected!");
});

// Initialize Queue with Redis Instance
var Q = new middleware.Q(Redis);

// add task to queue
app.post('/mail', function(req,res){

  /* expects { 
      auth: hash,             // required!
      to: email,              // required! 
      type: 'thanks_pledge',  // required!
      amount: amount,         // required!
      venmoid: username       // optional
    } 
  */
  var newtask = JSON.stringify(req.body);

  Q.add( newtask ).then(function( response ){
    res.send( response );
  }); 
});

var pledgeit = 'http://pledgeit-staging.herokuapp.com';
// Redirect on all other requests
app.use('*', function(req, res){
  res.redirect( pledgeit );
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