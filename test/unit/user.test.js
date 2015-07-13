var should = require('should'),
    models = require('../../models'),
    sequelize = models.sequelize,
    Division = models.Division,
    User = models.User;

describe('User', function() {
  before(function(done) {
    sequelize
      .sync({ force: true })
      .complete(done);
  });

  describe('instance', function() {
    describe('attributes', function() {
      describe('defaults', function() {
        var user;

        before(function(done) {
          User.create({
            name: 'Darth Vader',
            username: 'vadar'
          }).complete(function(err, u) {
            user = u;
            return done(err);
          });
        });

        it('should default `token` to `null`', function() {
          should.equal(user.token, null);
        });

        it('should default `location` to ""', function() {
          user.location.should.equal('');
        });

        it('should default `status` to `0`', function() {
          user.status.should.equal(0);
        });

        it('should default `back` to `null`', function() {
          should.equal(user.back, null);
        });

        it('should default `role` to "member"', function() {
          user.role.should.equal('member');
        });

        it('should default `avatar` to "/assets/images/lime-cat.jpg"', function() {
          user.avatar.should.equal('/assets/images/lime-cat.jpg');
        });

        it('should default `active` to `true`', function() {
          user.active.should.be.true;
        });
      });
    });

    describe('methods', function() {
      var user;

      before(function(done) {
        User.create({
          name: 'Obiwan Kenobi',
          username: 'obiwan'
        }).complete(function(err, u) {
          user = u;
          return done(err);
        });
      });

      describe('`toJSON()`', function() {
        var attrs;

        before(function() {
          attrs = user.toJSON();
        });

        it('should return safe attributes', function() {
          attrs.should.have.properties('name', 'username', 'avatar',
            'role', 'location', 'status', 'back');
        });

        it('should not return unsafe attributes', function() {
          attrs.should.not.have.properties('token', 'active');
        });
      });

      describe('`toSession()`', function() {
        var attrs;

        before(function() {
          attrs = user.toSession();
        });

        it('should return `toJSON()` attributes', function() {
          attrs.should.containEql(user.toJSON());
        });

        it('should include unsafe attributes, `token`', function() {
          attrs.should.have.properties('token');
        });
      });
    });
  });

  describe('division association', function() {
    var division;

    before(function(done) {
      Division.create({
        name: "Sith Lords"
      }).complete(function(err, d) {
        division = d;
        return done(err);
      });
    });

    it('should be able to associate', function(done) {
      User.create({
        name: 'Darth Siddious',
        username: 'siddious',
        division_id: division.id
      }).complete(function(err, user) {
        if(err) return done(err);

        user.getDivision().complete(function(err, d) {
          d.id.should.equal(division.id);
          return done(err);
        });
      });
    });
  });
});
