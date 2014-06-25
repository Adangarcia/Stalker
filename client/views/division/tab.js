/**
 * DivisionTabView - manage an individual division tab
 */

Stalker.DivisionTabView = Ember.View.extend({
  needs: ['application'],
  tagName: 'li',
  templateName: 'division/tab',
  classNames: ['tab'],
  classNameBindings: ['isActive:active'],
  currentUserBinding: 'controller.currentUser',

  /**
   * Is the this active?
   */

  isActive: function() {
    return this.get('controller.isActive');
  }.property('controller.isActive'),

  /**
   * Handle a doubleclick of a division tab
   * - used to signal an edit
   *
   * @param {jQuery.Event} e
   */

  doubleClick: function(e) {
    if(this.get('currentUser.isAdmin')) {
      this.get('controller').send('startEdit');
    }

    return false;
  },

  /**
   * This tab is active if the link has the active class
   */

  sendActive: function(e) {
    if(this.$('a').hasClass('active')) {
      this.get('controller').send('changeTab');
    }
  }.on('click', 'didInsertElement'),

  /**
   * Stop editing on enter press
   *
   * @param {jQuery.Event} e
   */

  keyPress: function(e) {
    if(e.keyCode === 13) {
      this.get('controller').send('stopEdit');
    }
  }

});
