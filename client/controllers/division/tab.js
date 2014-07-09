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

      this.set('isEditing', false);
      if(model.get('isDirty') && !model.get('isSaving') && model.get('name')) {
        model.save().catch(function() {
          model.rollback();
        });
      } else {
        model.rollback();
      }
    },

    destroy: function() {
      this.get('content').destroyRecord();
    },

    changeTab: function() {
      this.get('parentController').send('setTab', this);
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
