/**
 * DivisionNewView manage
 */

Stalker.DivisionNewView = Ember.View.extend({
  templateName: 'divisions/new',

  submit: function() {
    this.get('controller').send('closeModal');

    return false;
  },

  click: function(e) {
    var $e = $(e.target);

    if($e.is('.reveal-modal-bg')) {
      this.get('controller').send('closeModal');
    }

    return false;
  }
});
