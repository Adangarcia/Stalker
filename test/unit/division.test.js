var should = require('should'),
    models = require('../../models'),
    sequelize = models.sequelize,
    Division = models.Division,
    User = models.User;

describe('Division', function() {
  before(function(done) {
    sequelize
      .sync({ force: true })
      .complete(done);
  });

  describe('user association', function() {
    var user, division;

    before(function(done) {
      User.create({
        name: "Anakin Skywalker",
        username: "skywalker"
      }).complete(function(err, u) {
        if(err) return done(err);
        user = u;

        Division.create({
          name: 'Jedi'
        }).complete(function(err, d) {
          if(err) return done(err);
          division = d;

          return d.addUser(user).complete(done);
        });
      });
    });

    it('should be able to associate', function(done) {
      division.getUsers().complete(function(err, users) {
        users[0].name.should.equal(user.name);
        division.id.should.equal(users[0].division_id);
        return done(err);
      });
    });

    it('should remove user associations on destroy', function(done) {
      division.destroy().complete(function(err) {
        if(err) return done(err);

        user.reload().complete(function(err, u) {
          u.should.have.property('division_id', null);
          return done(err);
        });
      });
    });
  });
});
