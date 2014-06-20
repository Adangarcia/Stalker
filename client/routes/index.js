// import routes/application
// import routes/divisions/index

/**
 * Index route handler
 */

Stalker.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('user');
  }
});
