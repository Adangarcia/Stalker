Stalker.Division = DS.Model.extend({
  name: DS.attr('string'),

  users: DS.hasMany('user'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date')
});
