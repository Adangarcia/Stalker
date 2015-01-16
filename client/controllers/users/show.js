/**
 * UserShowController
 */

Stalker.UserShowController = Ember.ObjectController.extend({
  isEditedByViewable: function() {
    var admin = this.get('currentUser.isSuperAdmin');

    return admin && this.get('content.id') !== this.get('currentUser.id');
  }.property('currentUser.isSuperAdmin', 'content.id')
});
