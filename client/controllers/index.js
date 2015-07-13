// import controllers/application
// import controllers/user
// import controllers/users/index
// import controllers/division/index
// import controllers/divisions/index

/**
 * IndexController
 */

Stalker.IndexController = Ember.ArrayController.extend({
  sortAscending: false,
  sortProperties: ['isIn', 'isUnavailable', 'updated_at'],

  /**
   * Determine is there are users present
   *
   * @return {Boolean}
   */

  hasUsers: function() {
    return this.get('length') > 0;
  }.property('length')

});
