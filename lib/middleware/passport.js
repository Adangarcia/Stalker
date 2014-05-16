var passport = require('passport'),
    Strategy = require('passport-txssc').Strategy;

module.exports = function(app) {

  /**
   * Passport configuration
   */

  passport.use(new Strategy({
      clientID: app.get('passport key'),
      clientSecret: app.get('passport secret'),
      callbackURL: app.get('passport host')
    },
    function(token, secret, profile, done) {
      User.authorize(profile, token, function(err, user) {
        if(err) return done(err);
        return done(null, user.toSession());
      });
    }
  ));

};
