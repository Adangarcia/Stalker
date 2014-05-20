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
   * Ensure the current user has permissions for a specific resource,
   * magic tokens just continue through, since you know they're magic.
   *
   * @param {http.Request} req
   * @param {http.Response} res
   * @param {Function} next
   */

  function authorize(req, res, next) {
    if(req.user && req.user.role === 'member' && req.method.match(/POST|PUT|DELETE/)) {
      return res.json(403, { error: 'unauthorized' });
    }

    return next();
  }

  /**
   * Use our controller param middleware
   */

  app.param('user_id', controllers.Users.param);
  app.param('division_id', controllers.Divisions.param);

  return {
    '/*': {
      all: authorize
    },

    '/users': {
      get: controllers.Users.index,
      post: controllers.Users.create,

      '/:user_id': {
        get: controllers.Users.get,
        put: controllers.Users.update,
        delete: controllers.Users.destroy
      }
    },

    '/divisions': {
      get: controllers.Divisions.index,
      post: controllers.Divisions.create,

      '/:division_id': {
        get: controllers.Divisions.get,
        put: controllers.Divisions.update,
        delete: controllers.Divisions.destroy
      }
    }
  };
};
