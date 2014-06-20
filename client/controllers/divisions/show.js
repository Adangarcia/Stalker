/**
 * DivisionsShow Controller
 */

Stalker.DivisionsShowController = Ember.ObjectController.extend({

  /**
   * Does the current division have users?
   *
   * @return {Boolean}
   */

  hasUsers: function() {
    return this.get('users.length') > 0;
  }.property('users.length')

});
