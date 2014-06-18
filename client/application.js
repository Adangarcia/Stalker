(function(root) {
  var Stalker = root.Stalker = Ember.Application.create({
    LOG_TRANSITIONS: true,
    LOG_VIEW_LOOKUPS: true,
    LOG_MODULE_RESOLVER: true,
    LOG_ACTIVE_GENERATION: true,
    LOG_TRANSITIONS_INTERNAL: true,
  });

  /**
   * Configure the default RESTAdapter
   */

  Stalker.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api',
    defaultSerializer: DS.JSONSerializer
  });

  /**
   * Initializer for injecting the current user controller
   * into all controllers
   */

  Ember.Application.initializer({
    name: 'currentUser',
    after: 'store',

    initialize: function(container, application) {
      var store = container.lookup('store:main'),
          attrs = JSON.parse($('meta[name="current-user"]').attr('content'));

      // Add the current user to store
      var user = store.push('user', attrs);

      container.lookup('controller:currentUser').set('content', user);
      container.typeInjection('controller', 'currentUser', 'controller:currentUser');

      // Set the headers using the current users token
      //
      // TODO: Make this less of a hack!
      container.lookup('adapter:application').set('headers', {
        Authorization: attrs.token
      });
    }
  });

  /**
   * Initializer for adding socket event data to the store
   */

  Ember.Application.initializer({
    name: 'eventSource',
    after: 'store',

    initialize: function(container, application) {
      var store = container.lookup('store:main'),
          events = new EventSource('/events');

      events.addEventListener('user', function(e) {
        store.pushPayload('user', { user: JSON.parse(e.data) });
      });

      events.addEventListener('division', function(e) {
        store.pushPayload('division', { division: JSON.parse(e.data) });
      });
    }
  });


  // import models/index
  // import controllers/index
  // import views/index
  // import routes/index
  // import router
})(window);
