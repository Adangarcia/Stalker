var controllers = {
  API: require('./api'),
  Authentication: require('./authentication')
};

/**
 * Export our controllers
 */

module.exports = function(app) {

  /**
   * Return our routes to be recursively mounted
   */

  return {
    '/api': controllers.API(app),

    '/auth': {
      '/login': {
        get: controllers.Authentication.login,
      },

      '/logout': {
        get: controllers.Authentication.logout,
      },

      '/callback': {
        get: controllers.Authentication.authenticate
      }
    }
  };
};
