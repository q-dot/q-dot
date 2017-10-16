const assert = require('assert');
const { Client } = require('pg');
const request = require('request');
const db = require('../database/index.js');
const serverURL = 'http://127.0.0.1:1337';
const expect = require('chai').expect;

let options = {
        'method': 'GET',
        'uri': serverURL
    }

describe ('Restaurant API routes', function() {
  //drops database and recreates a new one with dummy data
  // before(function() {


  //   // return db.Queue.drop()
  //   //   .then(() => db.Customer.drop())
  //   //   .then(() => db.Restaurant.drop())
  //   //   .then(() => db.Restaurant.sync({force: true}))
  //   //   .then(() => db.Customer.sync({force: true}))
  //   //   .then(() => db.Queue.sync({force: true}))
  //   //   .catch(error => console.log('Error resetting database', error));
  // });

  describe ('GET request to /restaurants', function() {
    it ('should return index when a GET request is made to root directory of server', function(done) {
      request(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body).to.have.string('b@r3-m1n1mum5');
        done();
      })
    });

    it ('should return a 200 status code when a GET request is made to /managerlogin', function(done) {
      request(options, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    // handled by react--not testable in this way
    // it ('should redirect to login on GET request to /manager if not logged in', function(done) {
    //   request(options, function (err, res, body) {
    //     console.log(res);
    //     expect(body).to.have.string('login');
    //     done();
    //   })
    // });
  })

  //   it ('should return a 200 status code') {


  //   }


  //   it ('should return a list of restaurants', function(done) {
  //     var expectedResult = [
  //       {
  //         id: 1,
  //         image: '../images/tempestbar.jpg',
  //         name: 'Tempest',
  //         phone: '(123) 456-7890',
  //         'nextPosition': 2,
  //         status: 'Open',
  //         createdAt: '2017-10-04T21:41:25.071Z',
  //         updatedAt: '2017-10-04T21:41:25.071Z'
  //       },
  //       {
  //         id: 2,
  //         image: '../images/subway.jpg',
  //         name: 'Subway',
  //         phone: '(123) 456-7990',
  //         'nextPosition': 2,
  //         status: 'Open',
  //         createdAt: '2017-10-04T21:41:25.091Z',
  //         updatedAt: '2017-10-04T21:41:25.091Z'
  //       },
  //       {
  //         id: 3,
  //         image: '../images/chipotle.jpg',
  //         name: 'Chipotle',
  //         phone: '(132) 456-7990',
  //         'nextPosition': 1,
  //         status: 'Closed',
  //         createdAt: '2017-10-04T21:41:25.104Z',
  //         updatedAt: '2017-10-04T21:41:25.104Z'
  //       }
  //     ];
  //     request.get(`${serverURL}/restaurants`, (err, response, body) => {
  //       console.log('body', typeof body);
  //       console.log('expectedResult', typeof expectedResult);
  //       assert.deepEqual(expectedResult.length, JSON.parse(body).length);
  //       assert.deepEqual(expectedResult[0].name, JSON.parse(body)[0].name);
  //       assert.deepEqual(expectedResult[1].status, JSON.parse(body)[1].status);
  //       assert.deepEqual(expectedResult[2].phone, JSON.parse(body)[2].phone);
  //       done();
  //     });
  //   });
  // });
});

