/**
 * Application route
 */

Stalker.ApplicationRoute = Ember.Route.extend({

  /**
   * Load divisions for division/tabs template
   */

  model: function() {
    return this.store.find('division');
  },

  actions: {
    openModal: function(modal, model) {
      var controller = this.controllerFor(modal);

      controller.set('content', model);

      return this.render(modal, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }

});
