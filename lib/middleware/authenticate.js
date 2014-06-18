var User = require('../../models').User;

/**
 * Authentication middleware
 *
 * @param {http.Request} req
 * @param {http.Response} res
 * @param {Function} next
 */

module.exports = function(app) {
  var apiToken = app.get('api token');

  return function authenticate(req, res, next) {
    var token = req.get('Authorization');

    if(req.user || apiToken === token) return next();

    if(!token) {
      return res.format({
        text: function() {
          return res.redirect('/login');
        },

        json: function() {
          return res.json(401, { error: 'not authenticated' });
        }
      });
    } else {
      User.find({ where: { token: token } }).complete(function(err, user) {
        if(err) return res.json(500, { error: err });
        if(user) {
          req.user = user;
          return next();
        }

        return res.format({
          text: function() {
            return res.redirect('/login');
          },

          json: function() {
            return res.json(401, { error: 'not authenticated' });
          }
        });
      });
    }
  };
};
