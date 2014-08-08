/**
 * UserEditController manages the user edit modal
 */

Stalker.UserEditController = Ember.ObjectController.extend({
  pickerOpen: 0,
  divisions: null,
  isAllViewed: true,

  actions: {
    closeModal: function() {
      var model = this.get('content'),
          setDivision = this.get('selectedDivision');

      if(setDivision && setDivision.get('id') !== model.get('division.id')) {
        // Ensure the has many is cleared on division
        if(model.get('division')) {
          model.get('division').then(function(division) {
            division.get('users').removeObject(model);
          });
        }

        model.set('division', setDivision);

        // Ensure the has many association is added to the new division
        setDivision.get('users').then(function(users) {
          users.addObject(model);
        });

        model.save();
      } else if(model.get('isDirty')) {
        model.save();
      }

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

  /**
   * Get the current division set for user and
   * assign it to `selectedDivision`
   */

  getDivision: function() {
    var self = this,
        division = this.get('content.division');

    if(division) {
      division.then(function(division) {
        self.set('selectedDivision', division);
      });
    } else {
      this.set('selectedDivision', null);
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
    return this.get('currentUser.isAdmin') && this.get('isAllViewed');
  }.property('currentUser.isAdmin', 'isAllViewed'),

  /**
   * Helpers for finding the active button
   */

  isIn: function() {
    return this.isAt('in');
  }.property('location'),

  isOut: function() {
    return this.isAt('out');
  }.property('location'),

  isUnavailable: function() {
    return this.isAt('unavailable');
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
