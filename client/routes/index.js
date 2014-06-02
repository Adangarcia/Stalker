// import routes/divisions/index

/**
 * Index route handler
 */

Stalker.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.RSVP.hash({
      users: this.store.find('user'),
      divisions: this.store.find('division')
    });
  }
});
