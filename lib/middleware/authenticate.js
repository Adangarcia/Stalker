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
    var token = req.get('X-Auth-Token');

    if(req.user || token === req.get('Authorization')) return next();

    console.log(req.method);

    if(!token) {
      return res.format({
        text: function() {
          res.locals.flash = 'Not authenticated';
          return res.redirect('/login');
        },

        json: function() {
          return res.json(401, { error: 'not authenticated' });
        }
      });
    } else {
      User.find({ where: { token: token } }).complete(function(err, user) {
        if(err) return res.json(500, { error: err });
        if(user) return next();

        return res.format({
          text: function() {
            res.locals.flash = 'Not authenticated';
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
