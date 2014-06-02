/**
 * Ember.Router config for Stalker
 */

Stalker.Router.map(function() {
  this.resource('divisions', function() {
    this.route('new', { path: '/new' });
    this.route('show', { path: '/:division_slug' });
  });

  this.resource('users', function() {
    this.route('edit', { path: '/:user_id' });
  });
});
