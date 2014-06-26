/**
 * Show a user, you know the drill
 */

Stalker.UserShowView = Ember.View.extend({
  tagName: 'section',
  classNames: ['user'],
  templateName: 'users/show',
  classNameBindings: ['isEditable:editable', 'isNotIn:highlight'],
  currentUserBinding: 'controller.currentUser',

  /**
   * Does the current user has permissions that
   * enable them to edit this specific user?
   *
   * @return {Boolean}
   */

  isEditable: function() {
    return this.get('currentUser.isAdmin') ||
      this.get('content.id') === this.get('currentUser.id');
  }.property('currentUser', 'content.id'),

  /**
   * Is the user currently in?
   *
   * @return {Boolean}
   */

  isNotIn: function() {
    return !this.get('content.location').match(/^in$/i);
  }.property('content.location'),

  /**
   * Click handler for a user
   */

  click: function(e) {
    if(this.get('isEditable')) {
      this.get('controller').send('openModal', 'userEdit', this.get('content'));
    }
  }

});
