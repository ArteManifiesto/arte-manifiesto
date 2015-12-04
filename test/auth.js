var request = require('supertest');

describe('auth', function () {
  var server;
  beforeEach(function () {
    server = require('./../app');
  });

  afterEach(function () {
    server.close();
  });

  it('responds to /auth/login', function testSlash(done) {
  request(server)
    .get('/auth/login')
    .expect(200, done);
  });

  it('responds email dont exist when the email is incorrect', function(done) {
    request(server)
      .post('/auth/login')
      .send({email: 'development@gmail.com', password: 'cotecote'})
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res) {
        done();
      })
  });
});
