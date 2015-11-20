/**
 * UserShowController
 */

Stalker.UserShowController = Ember.ObjectController.extend({
  isEditedByViewable: Ember.computed.oneWay('currentUser.isSuperAdmin'),

  actions: {
    destroyUser: function() {
      var confirm = window.confirm("Are you sure?");

      if(confirm) {
        this.get("content").destroyRecord();
      }
    }
  }
});
