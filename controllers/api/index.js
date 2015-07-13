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
    var parts = req.params[0].split('/'),
        type = parts[0],
        id = parts[1] ? parseInt(parts[1], 10) : null;

    // Token auth or admin
    if(!req.user || req.user &&
       (req.user.role === 'admin' ||
       req.user.role === 'su')) return next();

    // A non-privileged request
    if(!req.method.match(/POST|PUT|DELETE/)) return next();

    // User is editing themself
    if(type === 'users' && id === req.user.id) return next();

    res.status(403);
    res.json({ error: 'unauthorized' });
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
