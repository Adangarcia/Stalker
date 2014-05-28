export default DS.Model.extend({
  name: DS.attr('string'),
  role: DS.attr('string'),
  username: DS.attr('string'),
  avatar: DS.attr('string'),
  location: DS.attr('string'),
  back: DS.attr('string'),

  division: DS.belongsTo('division'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date')
});
