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

  describe('user association', function() {
    var user;

    before(function(done) {
      User.create({
        name: "Anakin Skywalker",
        username: "skywalker"
      }).complete(function(err, u) {
        user = u;
        return done(err);
      });
    });

    it('should be able to associate', function(done) {
      Division.create({
        name: 'Jedi'
      }).complete(function(err, division) {
        if(err) return done(err);

        division.addUser(user).complete(function(err, u) {
          u.name.should.equal(user.name);
          division.id.should.equal(user.division_id);
          return done(err);
        });
      });
    });
  });
});
