Stalker.User = DS.Model.extend({
  name: DS.attr('string'),
  role: DS.attr('string'),
  username: DS.attr('string'),
  avatar: DS.attr('string'),
  location: DS.attr('string'),
  back: DS.attr('date'),

  division: DS.belongsTo('division', { async: true }),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  isIn: function() {
    return !!this.get('location').match(/^in$/i) || this.get('isUnavailable');
  }.property('location'),

  isUnavailable: function() {
    return !!this.get('location').match(/^unavaliable|meeting$/i);
  }.property('location')
});
