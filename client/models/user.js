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
    return !!this.get('location').match(/^in$/i);
  }.property('location')
});
