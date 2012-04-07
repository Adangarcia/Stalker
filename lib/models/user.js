var resourceful = require('resourceful');

var User = resourceful.define('user', function() {

  // Storage Engine
  this.use('memory');

  this.string('name');
  this.string('avatar');
  this.string('location');
  this.timestamps();

});

exports.User = User;