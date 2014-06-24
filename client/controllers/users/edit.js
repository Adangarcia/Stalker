/**
 * UserEditController manages the user edit modal
 */

Stalker.UserEditController = Ember.ObjectController.extend({
  pickerOpen: 0,
  divisions: [],
  selectedDivision: null,

  actions: {
    closeModal: function() {
      var model = this.get('content'),
          newDivision = this.get('selectedDivision');

      if(newDivision) {
        // Ensure the has many is cleared on division
        if(model.get('division')) {
          model.get('division').then(function(division) {
            division.get('users').removeObject(model);
          });
        }

        model.set('division', newDivision);

        // Ensure the has many association is added to the new division
        newDivision.get('users').then(function(users) {
          users.addObject(model);
        });
      }

      model.save();
      this.set('pickerOpen', 0);

      return true;
    },

    setLocation: function(l) {
      var model = this.get('content');

      model.set('location', l);
      model.set('back', null);
      model.save();
    },

    openPicker: function() {
      // TODO: Fix hack
      this.incrementProperty('pickerOpen');
    }
  },

  getDivision: function() {
    var self = this,
        division = this.get('content.division');

    if(division) {
      division.then(function(division) {
        self.set('selectedDivision', division);
      });
    }
  }.observes('content.division'),

  /**
   * Retrieve all divisions as a property
   */

  getDivisions: function() {
    var self = this;

    this.store.find('division').then(function(divisions) {
      self.set('divisions', divisions);
    });
  }.on('init'),

  /**
   * Can the current user edit the user contained in `model`?
   *
   * @return {Boolean}
   */

  isEditable: function() {
    return this.get('currentUser.isAdmin');
  }.property('currentUser.isAdmin'),

  /**
   * Helpers for finding the active button
   */

  isIn: function() {
    return this.isAt('in');
  }.property('location'),

  isOut: function() {
    return this.isAt('out');
  }.property('location'),

  isLunch: function() {
    return this.isAt('lunch');
  }.property('location'),

  /**
   * Logic for providing a match for what
   * button should be active
   *
   * @param {String} p
   * @return {Boolean}
   */

  isAt: function(p) {
    var matcher = new RegExp('^' + p + '$', 'i');

    return matcher.test(this.get('location'));
  }
});
