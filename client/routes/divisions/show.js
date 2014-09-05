/**
 * Render /divisions/1
 */

Stalker.DivisionsShowRoute = Ember.Route.extend({
  actions: {
    openModal: function(modal, model) {
      var controller = this.controllerFor(modal);

      controller.set('content', model);
      controller.set('isAllViewed', false);

      return true;
    },

    destroyTab: function() {
      this.transitionTo('index');
    }
  },

  model: function(params) {
    var self = this;
    var name = decodeURI(params.division_slug);

    return this.store.find('division', { name: name }).then(function(divisions) {
      if(!divisions.get('length')) {
        return self.transitionTo('divisions.404');
      }

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
