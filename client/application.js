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

    /**
     * Pass array attached to the actual attribute when finding many
     */

    findMany: function(store, type, ids) {
      return this.ajax(this.buildURL(type.typeKey), 'GET', { data: { id: ids } });
    },
  });

  /**
   * Define our store
   */

  Stalker.ApplicationStore = DS.Store.extend({

    /**
     * Handle pushing new server sent models into the store
     *
     * @param {String} type
     * @param {Object} data
     */

    pushServerModel: function(type, data) {
      var model = this.modelFor(type),
          serializer = this.serializerFor(type);

      var record = serializer.extract(this, model, data, data[type].id, 'single');

      return this.push(type, record);
    }
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

      // Add the current user to store with pushPayload in order to
      // run attributes through the serializer
      store.pushPayload('user', { user: attrs });

      // Defer app readiness so we can look up the user first
      application.deferReadiness();

      store.find('user', attrs.id).then(function(user) {
        container.lookup('controller:currentUser').set('content', user);
        container.typeInjection('controller', 'currentUser', 'controller:currentUser');

        application.advanceReadiness();
      });

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

      function parse(json) {
        var result;

        try {
          result = JSON.parse(json);
        } catch(e) {
          result = null;
          console.error('Invalid JSON format received from server.');
        }

        return result;
      }

      events.addEventListener('user', function(e) {
        var user = parse(e.data);

        if(!user) return;

        // TODO: Fix hack
        setTimeout(function() {
          store.pushServerModel('user', { user: user });
        }, 1000);
      });

      events.addEventListener('division', function(e) {
        var division = parse(e.data);

        if(!division) return;

        // TODO: Fix hack
        setTimeout(function() {
          store.pushServerModel('division', { division: division });
        }, 1000);
      });
    }
  });


  // import models/index
  // import controllers/index
  // import components/index
  // import views/index
  // import helpers/index
  // import routes/index
  // import router
})(window);
