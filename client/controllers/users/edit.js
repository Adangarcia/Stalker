/**
 * UserEditController manages the user edit modal
 */

Stalker.UserEditController = Ember.ObjectController.extend({
  pickerOpen: 0,
  divisions: null,
  isAllViewed: true,
  disabledLocationInput: true,

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
        model.set('last_edited_by', this.get('currentUser.content'));
        model.save();
      }

      this.set('disabledLocationInput', true);
      this.set('pickerOpen', 0);

      return true;
    },

    setStatus: function(s) {
      var l, c,
          model = this.get('content'),
          changed = model.changedAttributes();

      switch(s) {
        case 0:
          l = "Out";
          break;
        case 1:
          l = "In";
          break;
        case 2:
          l = "Unavailable";
          break;
      }

      if(!changed.location ||
         model.get('location') === "In" ||
         model.get('location') === "Out" ||
         model.get('location') === "Unavailable") {
        model.set('location', l);
      }

      this.set('disabledLocationInput', false);

      model.set('status', s);
      model.set('back', null);

      // Save the user that last edited this status
      model.set('last_edited_by', this.get('currentUser.content'));
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

  isDivisionEditable: function() {
    return this.get('currentUser.isSuperAdmin') && this.get('isAllViewed');
  }.property('currentUser.isSuperAdmin', 'isAllViewed'),

  /**
   * Returns `true` if the user is not editing themself
   *
   * @return {Boolean}
   */

  isNotEditingSelf: function() {
    return this.get('content.id') !== this.get('currentUser.id');
  }.property('content.id', 'currentUser.id')

});
