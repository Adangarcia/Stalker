/**
 * DivisionNewController
 */

Stalker.DivisionNewController = Ember.ObjectController.extend({
  actions: {
    closeModal: function() {
      var model = this.get('model');

      if(model.get('hasContent')) {
        model.save().catch(function() {
          model.destroyRecord();
        });
      } else {
        model.destroyRecord();
      }

      // bubble up
      return true;
    }
  }
});
