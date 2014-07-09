/**
 * Render /divisions/1
 */

Stalker.DivisionsShowRoute = Ember.Route.extend({
  actions: {
    destroyTab: function() {
      this.transitionTo('index');
    }
  },

  model: function(params) {
    var name = decodeURI(params.division_slug);

    return this.store.find('division', { name: name }).then(function(divisions) {
      return divisions.get('firstObject');
    });
  },

  /**
   * Serialize helper for divisions show route
   *
   * @param {DS.Model} model
   * @return {Object}
   */

  serialize: function(model) {
    return { division_slug: encodeURI(model.get('name')) };
  }
});
