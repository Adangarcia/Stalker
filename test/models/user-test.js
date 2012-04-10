/*
 * user-test.js Tests the User Model
 */

var should = require('should'),
    User = require('../../lib/models/user').User,
    redis = require('redis');

beforeEach(function(done) {
  var conn = redis.createClient();
  conn.FLUSHDB(function() {
    done();
  });
});


/* Seed DB with values */
function seed(objects, callback) {
  var len = objects.length,
      users = [],
      i = 0;

  objects.forEach(function(obj) {
    addUser(obj, function(err, user) {
      users.push(user);
      i++;
      if(i === len) return callback(users);
    });
  });
}

function addUser(user, callback) {
  User.create(user, callback);
}


describe('User', function() {

  /* Hooks */

  describe('hooks', function() {

    describe('save', function() {

      it('should lowercase name', function(done) {
        User.create({ name: 'Test User' }, function(err, user) {
          user.name.should.equal('test user');
          done();
        });
      });

      it('should check uniqueness of name', function(done) {
        seed([{name: "Test User"}, {name: "Another User"}], function() {
          User.create({ name: 'Test User' }, function(err, user) {
            should.exist(err);
            err.should.be.an.instanceof(Error);
            done();
          });
        });
      });
    });

    describe('update', function() {

      it('should lowercase name', function(done) {
        User.create({ name: 'Test User' }, function(err, user) {
          user.update({ name: 'Test Update'}, function(err) {
            user.name.should.equal('test update');
            done();
          });
        });
      });

      it('should check uniqueness of name', function(done) {
        seed([{name: "Test User"}, {name: "Another User"}], function(users) {
          users[0].update({ name: 'Another User' }, function(err) {
            should.exist(err);
            err.should.be.an.instanceof(Error);
            done();
          });
        });
      });
    });

  });

});