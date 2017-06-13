'use strict';
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../app.js');
var middleware = require('../middleware');
var testing = require('./test_instances');

// // Get Q With Redis
var Redis = testing.Redis;
var Q = testing.Q;

describe('The Red Queue', function() {

  beforeEach(function(done) {
    testing.flush();
    done();
  });

  afterEach(function(done) {
    testing.flush();
    done();
  });

  describe('Instantiation', function(){
    
    it('imports Redis', function(done) {
      expect( Redis ).to.be.an('object');   
      done();
    });

    it('imports Queue', function(done) {
      expect( middleware.Q ).to.be.a('function');
      done();
    });

    it('instantiates Queue with Redis instance', function(done) {
        
      expect( Q ).to.have.property( 'Red' ).to.be.a('object');
      expect( Q ).to.have.property( 'counter' ).to.be.a('string');
      expect( Q ).to.have.property( 'mail' ).to.be.a('string');
      expect( Q ).to.have.property( 'queue' ).to.be.a('string');
      done();
    });

  });

  describe('Queue Functions', function() {

      it('size: returns the size of the queue', function(done) {

        Q.size().then(function(size){
          expect(size).to.equal(0);
          done();
        });
      });

      it('get: retrieves and removes next key', function(done) {

        Q.add( testing.testEntry ).then(function(){
          Q.size().then(function(size1){
            expect( size1 ).to.equal(1);
            Q.next().then(function(key){
              expect( key ).to.equal('m0');
              Q.size().then(function(size2){
                expect( size2 ).to.equal(0);
                done();
              });
            });
          });
        })

      });

  });

  describe('Adds to Queue', function() {

    it('assigns key name based on counter', function(done) {

      Q.size().then(function(initSize){

        Q.add( testing.testEntry ).then(function(response){

          expect( response ).to.have.property('key','m'+initSize);
          done();
        });
      });
    });

    it('adds key to queue list', function(done) {

      Q.size().then(function(initSize){

        Q.add( testing.testEntry ).then(function(response){

          Q.size(function(size){ 
            expect( size ).to.equal( initSize + 1 ) 
          });
          done();
        });
      });
    });

    it('saves item to mail hash', function(done) {

      Q.add( testing.testEntry ).then(function(response){

        Q.get( Q.mail, response.key ).then(function(item){

          expect( response ).to.have.property('saved', 'OK');
          expect( item[0] ).to.equal( response.key );
          expect( item[1] ).to.deep.equal( JSON.parse(testing.testEntry) );
          done();
        });
      });
    });

  });

  describe('Process Next Item in Queue', function() {

    it('removes item from queue, storage and counter when processing it', 
      function(done) {

      Q.add( testing.testEntry ).then(function(add_response){
        Q.get( Q.mail, add_response.key ).then(function(item){

          expect( add_response ).to.have.property('saved', 'OK');
          expect( item[0] ).to.equal( add_response.key );
          expect( item[1] ).to.deep.equal( JSON.parse(testing.testEntry) );

          Q.size().then(function(size){ 
            expect(size).to.equal( 1 ); 
          });

          Q.do().then(function(do_response){

            expect( do_response ).to.have.property( 'sent', true );
            expect( do_response ).to.have.property( 'deleted', true );
            Q.size().then(function(size){ 
              expect(size).to.equal( 0 ); 
            });
            Q.get( Q.mail, do_response.key ).then(function(item){
              expect( item[1] ).to.equal( null );
              done();
            }); 

          });
        });
      });
    });

  });

  describe('Processes Range of Items in Queue', function() {

    it('gets and removes next passed in number of items from queue', function(done) {

      var test_entries = [];

      // add first
      Q.add( testing.testEntry ).then(function(add_response1){

        test_entries.push(add_response1);

        // add second
        Q.add( testing.testEntry ).then(function(add_response2){

          test_entries.push(add_response2);

          // add third
          Q.add( testing.testEntry ).then(function(add_response3){
          
            test_entries.push(add_response3);

            var test_entries_ok = test_entries.reduce(function(ok, entry){
              return (ok === null || !ok) ? (!!entry.saved) : (ok);
            }, null );

            // all items saved 
            expect( test_entries_ok ).to.equal( true );

            // size is 3
            Q.size().then(function(size){
              expect(size).to.equal(3);
            });

            // get range and test
            Q.doGroup(3).then(function(didGroup){

              // all items processed and deleted successfully
              expect( didGroup ).to.equal( true );

              // size is 0
              Q.size().then(function(size){
                expect(size).to.equal(0);
              });

              done();

            });
          });
        });
      });
    });

    it('gets and removes all items from queue if no amount passed in', function(done) {

      var test_entries = [];

      // add first
      Q.add( testing.testEntry ).then(function(add_response1){

        test_entries.push(add_response1);

        // add second
        Q.add( testing.testEntry ).then(function(add_response2){

          test_entries.push(add_response2);

          // add third
          Q.add( testing.testEntry ).then(function(add_response3){
          
            test_entries.push(add_response3);

            var test_entries_ok = test_entries.reduce(function(ok, entry){
              return (ok === null || !ok) ? (!!entry.saved) : (ok);
            }, null );

            // all items saved 
            expect( test_entries_ok ).to.equal( true );

            // size is 3
            Q.size().then(function(size){
              expect(size).to.equal(3);
            });

            // do all when no amount given
            Q.doGroup().then(function(didGroup){

              // all items processed and deleted successfully
              expect( didGroup ).to.equal( true );

              // size is 0
              Q.size().then(function(size){
                expect(size).to.equal(0);
                done();
              });
            });
          });
        });
      });

    });
  });

});

// -- adds mail to a different queue of reattempts on send fail
  //  ( this might not be needed here, possible mailgun option )
