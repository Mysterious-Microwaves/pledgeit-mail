'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
var middleware = require('../middleware');
var testing = require('./test_instances');

var Mail = middleware.Mail;

describe('Mailgun Service', function() {
    
  it('composes mail with item data + template', function(done) {

    var mail = Mail.composeMail( JSON.parse( testing.testEntry) );
    expect( mail ).to.have.property('to','oliverullman@gmail.com');
    expect( mail ).to.not.have.property('type');
    expect( mail ).to.not.have.property('amount');
    done();

  });

  it('sends mail to address', function(done) {
    this.timeout(5000);
    Mail.sendMail( JSON.parse( testing.testEntry) ).then(function(sent){
      expect( sent ).to.equal( true );
      done();
    });

  });

  it('creates venmo link with passed in data', function(done) {

    var testLink = 'https://venmo.com/?txn=pay&audience=private&recipients=VenmoUserOrPhoneOrEmail&amount=9000&note=Saving Ollies';
    
    var link = Mail.create_venmo( JSON.parse( testing.testEntryPay ) );
    
    expect( link ).to.equal( testLink );
    done();

  });

});