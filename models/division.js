var async = require('async'),
    Emitter = require('sequelize').Utils.CustomEventEmitter;

/**
 * Export for `sequelize.import` usage
 */

module.exports = function(sequelize, Types) {

  /**
   * Division model
   *
   * Division, has many users
   */

  var Division = sequelize.define('Division', {
    name: {
      type: Types.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        isUnique: function(name, next) {
          var self = this;

          Division.find({ where: { name: name } }).complete(function(err, d) {
            if(err) return next(err.message || err);
            if(d && d.id !== self.id) return next('Not unique');

            return next();
          });
        }
      }
    }
  },
  {
    classMethods: {

      /**
       * Return all records using `query`, and maps user ids to users
       *
       * Example:
       *  [
       *    {
       *      id: 1,
       *      name: 'Example',
       *      created_at: 'Fri Jun 06 2014 18:20:43 GMT+0000 (UTC)',
       *      updated_at: 'Fri Jun 06 2014 18:20:43 GMT+0000 (UTC)',
       *      users: [1, 2]
       *    }
       *  ]
       *
       * @param {Object} User - Here to only prevent a circular import on the User model
       * @param {Object} query
       * @return {CustomEventEmitter}
       */

      all: function(User, query) {
        var Division = this;

        return new Emitter(function(emitter) {
          Division.findAll({
            where: query,
            include: [{
              model: User,
              attributes: ['id']
            }]
          }).proxy(emitter, { events: ['error'] }).success(function(divisions) {
            async.map(divisions, function(division, done) {
              var d = division.toJSON();

              if(d.users) {
                d.users = division.users.map(function(u) {
                  return u.id;
                });
              }

              return done(null, d);
            }, function(err, divisions) {
              // Should never be an error here...
              return emitter.emit('success', divisions);
            });
          });
        }).run();
      }
    }
  });

  return Division;
};
