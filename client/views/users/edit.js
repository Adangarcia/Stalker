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
      minDate: 0,
      format:'m/d/Y H:i',
      // allowTimes: [
      //   '7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', '10:30',
      //   '11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00', '2:30',
      //   '3:00', '3:30', '4:00', '4:30', '5:00', '5:30'
      // ]
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
      picker.datetimepicker('open');
    }
  }.observes('controller.pickerOpen')

});
