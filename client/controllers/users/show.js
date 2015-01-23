/**
 * UserShowController
 */

Stalker.UserShowController = Ember.ObjectController.extend({
  isEditedByViewable: Ember.computed.oneWay('currentUser.isSuperAdmin')
});
