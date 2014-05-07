var controllers = {
  Users: require('./users')
};

/**
 * API Routes
 */

module.exports = function(app) {

  /**
   * Return our api routes to `app.map`
   */

  return {
    '/users': {
      get: controllers.Users.index,
      post: controllers.Users.create,

      '/:user_id': {
        get: controllers.Users.get,
        put: controllers.Users.update,
        del: controllers.Users.destroy
      }
    }
  };
};
