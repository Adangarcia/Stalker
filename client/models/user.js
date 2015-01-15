Stalker.User = DS.Model.extend({
  name: DS.attr('string'),
  role: DS.attr('string'),
  username: DS.attr('string'),
  avatar: DS.attr('string'),
  location: DS.attr('string'),
  status: DS.attr('number'),
  back: DS.attr('date'),

  division: DS.belongsTo('division', { async: true }),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  last_edited_by: DS.attr('string'),

  isOut: function() {
    return this.get('status') === 0;
  }.property('status'),

  isIn: function() {
    return this.get('status') === 1;
  }.property('status'),

  isUnavailable: function() {
    return this.get('status') === 2;
  }.property('status')

});
