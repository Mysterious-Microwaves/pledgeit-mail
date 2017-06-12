'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');
var middleware = require('../middleware');

var testEntry = JSON.stringify({ 
      to: 'oliverullman@gmail.com',
      type: 'test',
      amount: '9000'
    });

var Mail = middleware.Mail;

describe('Mailgun Service', function() {
    
  it('composes mail with item data + template', function(done) {

    var mail = Mail.composeMail( JSON.parse(testEntry) );
    expect( mail ).to.have.property('to','oliverullman@gmail.com');
    expect( mail ).to.not.have.property('type');
    expect( mail ).to.not.have.property('amount');
    done();
    
  });

  it('sends mail to address', function(done) {

    Mail.sendMail( JSON.parse(testEntry) ).then(function(sent){
      expect( sent ).to.equal( true );
      done();
    });

  });

});