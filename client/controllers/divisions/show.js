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
  }.property('users.length'),

  /**
   * Proxy users relation so we can sort it
   *
   * @return {Ember.ArrayProxy}
   */

  users: function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortAscending: true,
      sortProperties: ['isOut', 'isUnavailable', 'name'],
      content: this.get('content.users')
    });
  }.property('content.users')

});
