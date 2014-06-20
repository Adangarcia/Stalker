/**
 * Modal Component for various tasks
 */

Stalker.FocusInputComponent = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});
