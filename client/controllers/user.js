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
    return this.get('role') === 'admin';
  }

});
