'use strict';
const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js');

describe('basic server', function() {

  it('sends back you\'ve got mail', function(done) {
    request(app)
      .get('/mail')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.equal('You\'ve got mail!');
      })
      .end(done);
  });

  it('denies access to any other route', function(done) {
    request(app)
      .get('/any')
      .expect(200)
      .expect(function(res) {
        expect(res.text).to.equal('Where you going bro?');
      })
      .end(done);
  });

  it('accepts POST request', function(done) {
    request(app)
      .post('/mail')
      .expect(200) // should be 201 created
      .expect(function(res) {
        // expect(res.body.data).to.equal('Feed me!');
        expect(res.text).to.equal('Feed me!');
      })
      .end(done);
  });
});