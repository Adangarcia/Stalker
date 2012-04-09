var resourceful = require('resourceful-redis');

var User = resourceful.define('user', function() {

  // Storage Engine
  this.use("redis", {
    uri: "redis://127.0.0.1:6379",
    namespace: "users"
  });

  this.string('name');
  this.string('avatar');
  this.string('location');
  this.timestamps();

});

exports.User = User;