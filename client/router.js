/**
 * Ember.Router config for Stalker
 */

Stalker.Router.map(function() {
  this.resource('divisions', function() {
    this.route('show', { path: '/:division_slug' });
  });
});
