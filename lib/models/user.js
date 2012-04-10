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

User.before('save', function(instance, callback) {
  validate(instance, callback);
});

User.before('update', function(instance, callback) {
  validate(instance, callback);
});

function validate(instance, callback) {
  // Convert Name to lower case
  instance.name = instance.name.toLowerCase();

  // Check that name is unique
  User.find({name: instance.name}, function(err, results) {
    if(err || results.length !== 0) {
      if (err) return callback(err);
      else return callback(new Error('name is taken'));
    }
    callback(null);
  });
}


exports.User = User;