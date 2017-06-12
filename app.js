'use strict';
var app = require('express')();
var path = require('path');
var middleware = require('./middleware');

// 
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

// .POST MAIL QUEUE ENTRY/TASK
app.post('/mail', function(req,res){
  // => will receive a JSON with email data and add it to the queue
  // expects the req.body to have auth key to confirm comes from pledgeit
  // if req.body.auth === expected
  // Q.add(req.body); 
  res.send('Feed me!');
});


// We won't be using GET
app.get('/mail', function(req,res){
  res.send('You\'ve got mail!');
});


// DEFAULT for all unrecognized calls,
app.use('*', function(req, res){
  // pldegeit-mail/* ( serve error page, image )
  res.send("Where you going bro?");
});


// WORKER
// every minute it will go through the queue 
// and execute the tasks in it


// TEMPLATES 
// will be the templates to fill up and send 
// could be ejs


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

module.exports = app;