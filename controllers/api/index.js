var controllers = {
  Users: require('./users'),
  Divisions: require('./divisions')
};

/**
 * API Routes
 *
 * @param {Express.Application} app
 * @return {Object}
 */

module.exports = function(app) {

  /**
   * Authentication helper
   *
   * @param {http.Request} req
   * @param {http.Response} res
   * @param {Function} next
   */

  function authenticate(req, res, next) {
    var token = req.headers['Authorization'];

    if(token && token === app.get('api token')) {
      return next();
    }

    return res.json(401, { error: 'unauthorized' });
  }

  /**
   * Use our controller param middleware
   */

  app.param('user_id', controllers.Users.param);
  app.param('division_id', controllers.Divisions.param);

  return {
    '/*': {
      all: authenticate
    },

    '/users': {
      get: controllers.Users.index,
      post: controllers.Users.create,

      '/:user_id': {
        get: controllers.Users.get,
        put: controllers.Users.update,
        del: controllers.Users.destroy
      }
    },

    'divisions': {
      get: controllers.Divisions.index,
      post: controllers.Divisions.create,

      '/:division_id': {
        get: controllers.Divisions.get,
        put: controllers.Divisions.update,
        del: controllers.Divisions.destroy
      }
    }
  };
};
