// import routes/application
// import routes/divisions/index

/**
 * Index route handler
 */

Stalker.IndexRoute = Ember.Route.extend({
  actions: {
    openModal: function(modal) {
      this.controllerFor(modal).set('isAllViewed', true);

      return true;
    }
  },

  model: function() {
    return this.store.find('user');
  }
});
