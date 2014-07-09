/**
 * Ember.Router config for Stalker
 */

Stalker.Router.map(function() {
  this.resource('divisions', function() {
    this.route('404');
    this.route('show', { path: '/:division_slug' });
  });
});
