var controllers = {
  API: require('./api'),
  Pages: require('./pages'),
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

    '/': {
      get: controllers.Pages.index
    },

    '/login': {
      get: controllers.Pages.login
    },

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
