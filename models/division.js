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
    hooks: {

      /**
       * Reset the division on all users before destroying the model
       *
       * @param {Object} model
       * @param {Function} done
       */

      beforeDestroy: function(model, done) {
        model.getUsers().complete(function(err, users) {
          async.each(users, function(user, next) {
            user.setDivision(null).complete(next);
          },
          function(err) {
            return done(null, model);
          });
        });
      }
    },

    instanceMethods: {

      /**
       * Update the current record and return the division, with user ids
       *
       * Example:
       *  {
       *    id: 1,
       *    name: 'Example',
       *    created_at: 'Fri Jun 06 2014 18:20:43 GMT+0000 (UTC)',
       *    updated_at: 'Fri Jun 06 2014 18:20:43 GMT+0000 (UTC)',
       *    users: [1, 2]
       *  }
       *
       * @param {sequelize.Model} User
       * @param {Object} attrs
       * @return {sequelize.Utils.CustomEventEmitter}
       */

      update: function(attrs) {
        var self = this;

        if(attrs.role !== undefined) {
          delete attrs.role;
        }

        return new Emitter(function(emitter) {
          self.updateAttributes(attrs).proxy(emitter, {
            events: ['error']
          }).success(function(division) {
            division.getUsers({ attributes: ['id'] }).proxy(emitter, {
              events: ['error']
            }).success(function(users) {
              async.map(users, function(user, done) {
                return done(null, user.id);
              }, function(err, users) {
                division = division.toJSON();
                division.users = users;
                return emitter.emit('success', division);
              });
            });
          });
        }).run();
      }
    },

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
       * @return {sequelize.Utils.CustomEventEmitter}
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
