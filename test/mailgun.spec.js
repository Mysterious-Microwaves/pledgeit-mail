'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
var middleware = require('../middleware');


// Instantiate Redis
// var Redis = middleware.redis.createClient(7357, '127.0.0.1');

// // Instantiate Queue
// var Q = new middleware.Q(Redis);

var testEntry = JSON.stringify({ 
      to: 'test@email.com',
      type: 'test',
      amount: '9000'
    });

var Mail = middleware.Mail;

xdescribe('Mailgun Service', function() {

  describe('Instantiation', function(){
    
    it('instantiates Mailgun', function(done) {
      expect( Redis ).to.be.an('object');      
      done();
    });

  });

});