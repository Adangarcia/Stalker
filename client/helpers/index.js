/**
 * Helper for date values, displays the timeago
 */

Ember.Handlebars.registerBoundHelper('timeago', function(date) {
  if(typeof date === 'undefined' || !(date instanceof Date)) return '';
  return new Ember.Handlebars.SafeString('<time datetime="' +
    date.toISOString() + '">' + moment(date).calendar() + "</time>");
});
