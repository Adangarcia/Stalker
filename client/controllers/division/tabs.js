/**
 * Division Tabs controller
 */

Stalker.DivisionTabsController = Ember.ArrayController.extend({
  activeTab: null,
  sortAscending: true,
  sortProperties: ['name'],

  actions: {
    add: function() {
      var model = this.store.createRecord('division');

      return this.send('openModal', 'divisionNew', model);
    },

    setTab: function(tab) {
      var current = this.get('activeTab');

      if(current) {
        current.set('isActive', false);
      }

      tab.set('isActive', true);
      this.set('activeTab', tab);
    }
  },

  /**
   * Return if the current user is an admin
   *  - just passes this functionality to the `CurrentUserController`
   *
   * @return {Boolean}
   */

  isAdmin: function() {
    return this.get('currentUser.isAdmin');
  }.property('currentUser.isAdmin')

});
