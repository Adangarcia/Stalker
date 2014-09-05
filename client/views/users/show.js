/**
 * Show a user, you know the drill
 */

Stalker.UserShowView = Ember.View.extend({
  tagName: 'section',
  classNames: ['user'],
  templateName: 'users/show',
  classNameBindings: [
    'isEditable:editable',
    'isOut:red-highlight',
    'isUnavailable:yellow-highlight',
  ],
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

  isOut: function() {
    return this.get('content.isOut');
  }.property('content.status'),

  /**
   * Is the user currently unavailable?
   *
   * @return {Boolean}
   */

  isUnavailable: function() {
    return this.get('content.isUnavailable');
  }.property('content.isUnavailable'),

  /**
   * Click handler for a user
   */

  click: function(e) {
    if(this.get('isEditable')) {
      this.get('controller').send('openModal', 'userEdit', this.get('content'));
    }
  }

});
