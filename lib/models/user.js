var resourceful = require('resourceful-redis');

module.exports = function(emitter) {

  var User = resourceful.define('user', function() {

    // Storage Engine
    this.use("redis", {
      uri: "redis://127.0.0.1:6379",
      namespace: "users"
    });

    this.string('name').sanitize('lower');
    this.string('avatar');
    this.string('location');
    this.string('returning');
    this.timestamps();

  });

  // Rewrite _id to id, ensures new hubot script compatability
  User.prototype.toJSON = function() {
    return {
      id: this.id,
      _id: this.id,
      name: this.name,
      avatar: this.avatar,
      location: this.location,
      returning: this.returning
    };
  };

  User.before('save', function(instance, callback) {
    validate(instance, function(err, obj) {
      if (err) return callback(err);
      return callback(null);
    });
  });

  User.before('update', function(instance, callback) {
    validate(instance, function(err, obj) {
      if (err) return callback(err);
      return callback(null);
    });
  });

  User.on('save', function(instance) {
    emitter.emit('user:save', instance);
  });

  User.on('update', function(instance) {
    emitter.emit('user:update', instance);
  });

  function validate(instance, callback) {

    // Check Name
    if(instance.name) {
      // Convert Name to lower case
      instance.name = instance.name.toLowerCase();

      // Check that name is unique
      User.find({name: instance.name}, function(err, results) {
        if(err || results.length !== 0) {
          if (err) { return callback(err); }
          else { return callback(new Error('name is taken')); }
        }
        return callback();
      });
    }
    else {
      return callback();
    }
  }

  return User;
};
