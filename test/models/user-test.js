/*
 * user-test.js Tests the User Model
 */

var should = require('should'),
    User = require('../../lib/models/user').User,
    redis = require('redis'),
    conn = redis.createClient();


beforeEach(function(done) {
  conn.FLUSHDB(done);
});


describe('sanitize', function() {

  beforeEach(function(done) {
    var self = this;

    User.create({name: 'Bob'}, function(err, user) {
      if(err) return done(err);
      self.user = user;
      done();
    });
  });

  describe('on .create()', function() {
    it('should lowercase name on create', function() {
      var self = this.user;
      self.name.should.equal('bob');
    });
  });

  describe('on .update()', function() {
    it('should lowercase name on update', function(done) {
      var self = this.user;
      this.user.update({name: 'Mike'}, function(err, obj) {
        should.not.exist(err);
        self.name.should.equal('mike');
        done();
      });
    });
  });
});

/* Hooks */

describe('hooks', function() {

  beforeEach(function(done) {
    User.create({name: 'Bob'}, function(err, user) {
      if(err) return done(err);
      done();
    });
  });

  it('should check uniqueness of name on .create()', function(done) {
    User.create({name: 'Bob'}, function(err, obj) {
      should.exist(err);
      err.should.be.an.instanceof(Error);
      done();
    });
  });

  it('should check uniqueness of name on .save()', function(done) {
    User.create({name: 'Suzy'}, function(err, obj) {
      obj.name = "Bob";
      obj.save(function(err, user) {
        should.exist(err);
        err.should.be.an.instanceof(Error);
        done();
      });
    });
  });

  it('should check uniqueness of name on .update()', function(done) {
    User.create({name: 'Suzy'}, function(err, obj) {
      obj.update({ name: 'Bob' }, function(err) {
        should.exist(err);
        err.should.be.an.instanceof(Error);
        done();
      });
    });
  });

  it('should return successfully on non-validated properties', function(done) {
    User.create({name: 'Suzy'}, function(err, obj) {
      obj.update({ location: 'office' }, function(err, instance) {
        should.not.exist(err);
        instance.should.be.an.instanceof(User);
        done();
      });
    });
  });

});
