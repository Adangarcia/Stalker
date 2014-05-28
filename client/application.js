var token = $('[name="authorization]').attr('content');

DS.RESTAdapter.reopen({
  headers: {
    'Authorization': token
  }
});

export default Ember.Application.create({
  LOG_TRANSITIONS: true,
  LOG_VIEW_LOOKUPS: true,
  LOG_MODULE_RESOLVER: true,
  LOG_ACTIVE_GENERATION: true,
  LOG_TRANSITIONS_INTERNAL: true
});
