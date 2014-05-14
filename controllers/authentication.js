var passport = require('passport');

/**
 * Authentication routes
 */

module.exports = {

  /**
   * Login route
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  login: passport.authorize('txssc', { failureRedirect: '/'}),

  /**
   * Logout route
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  logout: function(req, res) {
    req.logout();
  },

  /**
   * Authenticate route
   *  - pass heavy lifting for logging a user in to passport
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  authenticate: passport.authorize('txssc', { failureRedirect: '/' }),
  function(req, res) { });
  }

};
