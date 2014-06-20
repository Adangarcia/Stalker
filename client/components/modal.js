/**
 * Modal Component for various tasks
 */

Stalker.ModalDialogComponent = Ember.Component.extend({
  actions: {
    close: function() {
      this.sendAction();
    }
  },

  didInsertElement: function() {
    this.$('.reveal-modal').fadeIn('400');
    this.$('.reveal-modal-bg').fadeIn('400');
  }
});
