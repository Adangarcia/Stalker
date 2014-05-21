var should = require('should'),
    request = require('supertest'),
    app = require('../../app');

describe('Pages `/`', function() {
  describe('without session', function() {
    it('should redirect to login ', function(done) {
      request(app)
        .get('/')
        .expect('Location', '/login')
        .expect(302, done);
    });

    it('should render login', function(done) {
      request(app)
        .get('/login')
        .expect(/Login with TxSSC/, done);
    });
  });

  describe('with session', function() {

  });
});
