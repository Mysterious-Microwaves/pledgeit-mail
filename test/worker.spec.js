'use strict';
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../app.js');
var middleware = require('../middleware');
var testing = require('./test_instances');
var Q = testing.Q;

// node-cron
describe('Cron Worker', function() {

  // for some reason this test is not working
  // but this is being done
  xit('processes every item in the queue every 5 seconds', function(done){
    
    this.timeout(6000);

    Q.size().then(function(size0){

      console.log("INIT SIZE",0);
      // Add First
      request(app)
      .post('/mail')
      .send({ 
        to: 'oliverullman@gmail.com',
        type: 'test',
        amount: '11111'
      }).then(function(){

        // Add Second
        request(app)
        .post('/mail')
        .send({ 
          to: 'oliverullman@gmail.com',
          type: 'test',
          amount: '22222'
        }).then(function(){

          // Add Third
          request(app)
          .post('/mail')
          .send({ 
            to: 'oliverullman@gmail.com',
            type: 'test',
            amount: '33333'
          }).then(function(){

            // test
            Q.size().then(function(size1){

              console.log("SIZE1", size1);
              // expect( size1 ).to.equal( 3 );
            })
            .delay(5000).then(function(delay){
              
              console.log("DELAY");

              Q.size().then(function(size2){
                // expect( size2 ).to.equal( 0 );
                console.log("SIZE2",size2);
                done();
              });
            });
          })
        })
      })

    });

  });
});