/**
 * Convert a text field into date input
 */

Stalker.DateInputComponent = Ember.TextField.extend({
  type: 'text',
  placeholder: '__/__/____ __:__',
  valueBinding: 'formattedValue',

  setDate: function() {
    var value = this.get('value');

    if(value && value.match(/\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}/)) {
      this.set('date', new Date(value));
    } else {
      this.set('date', null);
    }
  }.observes('value'),

  formattedValue: function() {
    var date = this.get('date');

    if(!date) return null;

    return (date.getMonth() + 1) + '/' + date.getDate() + '/' +
      date.getFullYear() + ' ' + date.getHours() + ':' +
      (date.getMinutes() === 0 ? '00' : date.getMinutes());
  }.property()
});
