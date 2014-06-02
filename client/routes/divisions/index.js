/**
 * Render /divisions/1
 */

Stalker.DivisionsShowRoute = Ember.Route.extend({
  model: function(params) {
    var name = decodeURI(params.division_slug);

    return this.store.find('division', { name: name });
  },

  serialize: function(model) {
    return { division_slug: encodeURI(model.get('name')) };
  }
});
