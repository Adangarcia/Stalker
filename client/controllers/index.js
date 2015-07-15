// import controllers/application
// import controllers/user
// import controllers/users/index
// import controllers/division/index
// import controllers/divisions/index

/**
 * IndexController
 */

Stalker.IndexController = Ember.ArrayController.extend({
  sortAscending: true,
  sortProperties: ['isOut', 'isUnavailable', 'name'],

  /**
   * Determine is there are users present
   *
   * @return {Boolean}
   */

  hasUsers: function() {
    return this.get('length') > 0;
  }.property('length'),

  actions: {
    toggleSort: function() {
      console.log('test');
      if (this.sortProperties[2] === 'updated_at') {
        this.set('sortProperties', ['isOut', 'isUnavailable', 'name']);
        this.set('sortAscending', true);
      }
      else {
        this.set('sortProperties', ['isIn', 'isUnavailable', 'updated_at']);
        this.set('sortAscending', false);
      }
    }
  }

});
