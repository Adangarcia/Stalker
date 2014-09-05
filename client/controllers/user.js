/**
 * Controller for accessing the current user
 */

Stalker.CurrentUserController = Ember.ObjectController.extend({

  /**
   * Is the current user an admin?
   *
   * @return {Boolean}
   */

  isAdmin: function() {
    return this.get('isSuperAdmin') || this.get('role') === 'admin';
  }.property('isSuperAdmin', 'role'),

  /**
   * Is the current user a super admin?
   *
   * @return {Boolean}
   */

  isSuperAdmin: function() {
    return this.get('role') === 'su';
  }.property('role')

});
