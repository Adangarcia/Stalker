/**
 * User Edit
 */

Stalker.UserEditView = Ember.View.extend({
  picker: null,
  templateName: 'users/edit',
  classNames: ['user-edit'],

  click: function(e) {
    var $e = $(e.target);

    if($e.is('.reveal-modal-bg')) {
      this.get('controller').send('closeModal');
    }

    return true;
  },

  submit: function() {
    this.get('controller').send('closeModal');

    return false;
  },

  didInsertElement: function() {
    var picker = this.$('[name="back"]').datetimepicker({
      step: 15,
      minDate: 0,
      format:'m/d/Y H:i'
    });

    this.set('picker', picker);
  },

  /**
   * Destroy the datetimepicker on view destruction
   */

  willClearRender: function() {
    this.get('picker').datetimepicker('destroy');
  },

  /**
   * TODO: Fix this hack - here because I could
   *       not get actions to target view
   */

  openPicker: function() {
    var picker = this.get('picker');

    if(picker) {
      picker.datetimepicker('show');
    }
  }.observes('controller.pickerOpen')

});
