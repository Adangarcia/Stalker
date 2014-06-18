var passport = require('passport'),
    User = require('../../models').User,
    Strategy = require('passport-txssc').Strategy;

module.exports = function(app) {

  /**
   * Passport configuration
   */

  passport.use(new Strategy({
      clientID: app.get('passport key'),
      clientSecret: app.get('passport secret'),
      callbackURL: 'http://' + app.get('passport host') + '/auth/callback'
    },
    function(token, secret, profile, done) {
      User.authorize(profile, token).complete(function(err, user) {
        return done(null, user);
      });
    }
  ));

  /**
   * Session serialization
   */

  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.find(id).complete(function(err, user) {
      return done(err, user);
    });
  });
};
