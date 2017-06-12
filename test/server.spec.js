'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');

describe('basic server', function() {

  it('adds task to queue on POST /mail', function(done) {
    request(app)
      .post('/mail')
      .expect(200) // should be 201 created
      .expect(function(res) {
        expect(res.body.saved).to.equal('OK');
      })
      .end(done);
  });

  it('redirects to main site on GET /mail', function(done) {

    var pledgeit = 'http://pledgeit-staging.herokuapp.com';

    request(app)
      .get('/mail')
      .expect(function(res) {
        expect(res.header['location']).to.equal( pledgeit );
      })
      .end(done);
  });

  
});