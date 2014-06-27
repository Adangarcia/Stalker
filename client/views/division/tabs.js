/**
 * DivisionTabs view, manage the currently active division tab
 */

Stalker.DivisionTabsView = Ember.View.extend({

  displayingAll: function() {
    var $e = this.$('[data-view="all"]');

    if(!$e) return;

    if(this.get('controller.displayingAll')) {
      $e.addClass('active');
    } else {
      $e.removeClass('active');
    }
  }.observes('controller.displayingAll'),

  /**
   * Is the all tab being viewed?
   */

  isAllDisplayed: function() {
    var $e = this.$('li .active');

    if($e.parent().is('[data-view="all"]')) {
      this.get('controller').send('setAllTab');
    }
  }.on('didInsertElement')

});
