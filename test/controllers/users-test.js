/*
 * users-test.js Tests the Users controller of the API
 */

var should = require('should'),
    request = require('request'),
    flatiron = require('flatiron'),
    users = require('../../lib/controllers/users'),
    app = flatiron.app;


app.use(flatiron.plugins.http);
app.router.path(/users/i, users);
app.start(9090);


/*
 * Request Helpers
 */

function makeGetReq(uri, cb) {
  request.get({
    uri: 'http://127.0.0.1:9090' + uri,
    headers: {
      'content-type': 'application/json'
    }
  }, cb);
}

function makePostReq(uri, data, cb) {
  request.post({
    uri: 'http://127.0.0.1:9090' + uri,
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  }, cb);
}

function makePutReq(uri, data, cb) {
  request.put({
    uri: 'http://127.0.0.1:9090' + uri,
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  }, cb);
}

function makeDeleteReq(uri, cb) {
  request.del({
    uri: 'http://127.0.0.1:9090' + uri,
    headers: {
      'content-type': 'application/json'
    }
  }, cb);
}


describe('Users', function() {

  /*
   * POST /users
   */

  describe('POST /users', function() {
    var result, data;

    // Test Invalid User Object
    describe('invalid user object', function() {

      before(function(done) {
        makePostReq('/users', {}, function(err, res, body) {
          result = res;
          data = JSON.parse(body);
          done();
        });
      });

      it('should return a 400 status code', function() {
        result.statusCode.should.equal(400);
      });

      it('should return an error message', function() {
        should.exist(data.error);
      });
    });

    // Test Valid User Object
    describe('valid user object', function() {

      before(function(done) {
        makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
          result = res;
          data = JSON.parse(body);
          done();
        });
      });

      it('should return a 201 status code', function() {
        result.statusCode.should.equal(201);
      });

      it('should return a user object', function() {
        data.name.should.equal('Test User');
        should.exist(data.avatar);
      });
    });

  });


  /*
   * GET /users
   */

  describe('GET /users', function() {
    var result, data;

    before(function(done) {
      // add a user
      makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
        makeGetReq('/users', function(err, res, body) {
          result = res;
          data = JSON.parse(body);
          done();
        });
      });
    });

    it('should return a 200 status code', function() {
      result.statusCode.should.equal(200);
    });

    it('should return an array', function() {
      data.should.be.an.instanceof(Array);
    });
  });


  /*
   * GET /users/:id
   */

  describe('GET /users/:id', function() {
    var result, data;

    // Test valid user
    describe('valid user', function() {

      before(function(done) {
        // add a user to ensure a good ID
        makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
          var id = JSON.parse(body)._id;

          makeGetReq('/users/' + id, function(err, res, body) {
            result = res;
            data = JSON.parse(body);
            done();
          });
        });
      });

      it('should return a 200 status code', function() {
        result.statusCode.should.equal(200);
      });

      it('should return a user object', function() {
        data.name.should.equal('Test User');
        should.exist(data.avatar);
      });
    });

    // Test invalid user
    describe('invalid user', function() {

      before(function(done) {
        makeGetReq('/users/200', function(err, res, body) {
          result = res;
          data = JSON.parse(body);
          done();
        });
      });

      it('should return a 404 status code', function() {
        result.statusCode.should.equal(404);
      });

      it('should return an error message', function() {
        should.exist(data.error);
      });
    });
  });

  /*
   * PUT /users/:id
   */

  describe('PUT /users/:id', function() {
    var result, data;

    // Test invalid user object
    describe('invalid user', function() {

      before(function(done) {
        // add a user to ensure a good ID
        makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
          var id = JSON.parse(body)._id;

          makePutReq('/users/' + id, {}, function(err, res, body) {
            result = res;
            data = JSON.parse(body);
            done();
          });
        });
      });

      it('should return a 400 status code', function() {
        result.statusCode.should.equal(400);
      });

      it('should return an error message', function() {
        should.exist(data.error);
      });
    });

    // Test valid User Object
    describe('valid user object', function() {

      before(function(done) {
        // add a user to ensure a good ID
        makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
          var id = JSON.parse(body)._id;

          makePutReq('/users/' + id, {name: 'Johnny Walker'}, function(err, res, body) {
            result = res;
            data = JSON.parse(body);
            done();
          });
        });
      });

      it('should return a 200 status code', function() {
        result.statusCode.should.equal(200);
      });

      it('should update user resource', function() {
        data.name.should.equal('Johnny Walker');
      });
    });

  });


  /*
   * DELETE /users/:id
   */

  describe('DELETE /users/:id', function() {
    var result, data;

    // Test valid user
    describe('valid user', function() {

      before(function(done) {
        // add a user to ensure a good ID
        makePostReq('/users', {name: 'Test User'}, function(err, res, body) {
          var id = JSON.parse(body)._id;

          makeDeleteReq('/users/' + id, function(err, res) {
            result = res;
            done();
          });
        });
      });

      it('should return a 204 status code', function() {
        result.statusCode.should.equal(204);
      });

    });
  });

});

