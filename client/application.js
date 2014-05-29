(function(root) {
  var Stalker = root.Stalker = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_MODULE_RESOLVER: true,
    LOG_ACTIVE_GENERATION: true,
    LOG_TRANSITIONS_INTERNAL: true,
  });

  /**
   * Add our token to the default RESTAdapter headers
   */

  DS.RESTAdapter.reopen({
    namespace: '/api/',
    headers: {
      'Authorization': $('[name="authorization]').attr('content')
    }
  });

  // import models/index
  // import controllers/index
  // import routes/index
  // import router
})(window);
