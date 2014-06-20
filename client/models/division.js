Stalker.Division = DS.Model.extend({
  name: DS.attr('string'),

  users: DS.hasMany('user', { async: true }),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  /**
   * Helper to determine if this division has content associated with it
   *
   * @return {Boolean}
   */

  hasContent: function() {
    var name = this.get('name');

    return name && name.length > 0;
  }.property('name')
});
