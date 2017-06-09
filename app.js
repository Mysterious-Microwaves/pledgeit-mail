'use strict';

var app = require('express')();
var path = require('path');
var middleware = require('./middleware');

app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser({ limit: '50mb' }));


// TEST DRIVEN DEVELOPMENT
// using Mocha


// QUEUE is a redis-cache,
// save queue snapshot before and after every worker execution
// if it crashes, we don't loose queue ( rebuild from snapshot )
// snapshot === file?


// WORKER
// every minute it will go through the queue and execute the tasks in it


// TEMPLATES 
// will be the templates to fill up and send 
// could be ejs


// AUTHENTICATE
// the request is coming from the verified client


// .POST MAIL QUEUE ENTRY/TASK
// pledgeit-mail/mail
// => will receive a JSON with email data and add it to the queue
app.post('/mail', function(req,res){

  res.send('Feed me!');

});

app.get('/mail', function(req,res){

  res.send('You\'ve got mail!');

});


// DEFAULT ROUTE for unrecognized calls,
// pldegeit-mail/* ( serve error page, image )
app.use('*', function(req, res){

  res.send("Where you going bro?");

})

// default dev-mode config files,
// ignored on .gitignore

module.exports = app;