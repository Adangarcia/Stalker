/**
 * Division Tab controller
 */

Stalker.DivisionTabController = Ember.ObjectController.extend({
  isActive: false,
  isEditing: false,

  actions: {
    startEdit: function() {
      this.set('isEditing', true);
    },

    stopEdit: function() {
      var model = this.get('model');

      if(model.get('isDirty') && !model.get('isSaving') && model.get('name')) {
        model.save().catch(function() {
          model.rollback();
        });
      } else {
        model.rollback();
      }

      this.set('isEditing', false);
    },

    destroyTab: function() {
      var d = window.confirm("Are you sure you want to delete this division?");

      if(d) {
        this.get('content').destroyRecord();
        this.get('parentController').send('setAllTab');

        return true; // bubble to route
      } else {
        return false;
      }
    },

    changeTab: function() {
      this.get('parentController').send('setTab', this);
    }
  },

  /**
   * Return if the current user is a super duper admin
   *
   * @return {Boolean}
   */

  isSuperAdmin: function() {
    return this.get('currentUser.isSuperAdmin');
  }.property('currentUser.isSuperAdmin')

});
