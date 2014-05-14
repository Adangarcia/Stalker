var utils = require('../lib').utils,
    Emitter = require('sequelize').Utils.CustomEventEmitter;

/**
 * Export for `sequelize.import` usage
 */

module.exports = function(sequelize, Types) {

  /**
   * User model
   *
   * User data from passport
   */

  return sequelize.define('User', {
    name: {
      type: Types.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    username: {
      type: Types.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },

    role: {
      type: Types.STRING,
      allowNull: false,
      defaultValue: 'member',
      validate: {
        notEmpty: true
      }
    },

    avatar: {
      type: Types.STRING,
      defaultValue: '/assets/images/lime-cat.jpg'
    },

    active: {
      type: Types.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    location: {
      type: Types.STRING,
      defaultValue: ''
    },

    back: {
      type: Types.STRING,
      defaultValue: ''
    },

    token: {
      type: Types.STRING,
      defaultValue: null
    }
  },
  {
    instanceMethods: {

      /**
       * Override the default `toJSON` and remove authentication token
       * from the returned attributes
       *
       * @return {Object}
       */

      toJSON: function() {
        var attrs = utils.clone(this.values);

        delete attrs.token;
        delete attrs.active;

        return attrs;
      },

      /**
       * Serialize a user to a session object
       *
       * @return {Object}
       */

      toSession: function() {
        var attrs = this.toJSON();

        return {
          name: attrs.name,
          username: attrs.username,
          avatar: attrs.avatar,
          role: attrs.role
        };
      }

    },

    classMethods: {

      /**
       * Authorization helper
       *  - finds or creates a user
       *  - updates attributes of the user with attributes from
       *      the oauth provider
       *  - sets the user's authentication token to the new token
       *
       * Example:
       *   User.authorize({ username: 'waldo', name: 'Waldo' }).complete(...)
       *
       * @param {Object} user attributes of the user
       * @return {Sequelize.Utils.CustomEventEmitter}
       */

      authorize: function(user) {
        var attrs = {},
            User = this;

        ['name', 'role',
         'avatar', 'token'].forEach(function(attr) {
          if(typeof user[attr] !== 'undefined' && user[attr].length) {
            attrs[attr] = user[attr];
          }
        });

        return new Emitter(function(emitter) {
          User
            .find({ where: { username: user.username } })
            .proxy(emitter, { events: ['error'] })
            .success(function(user) {
              if(!user) {
                attrs.username = user.username;

                User
                  .create(attrs)
                  .proxy(emitter, { events: ['error'] })
                  .success(function(user) {
                    return emitter.emit('success', user);
                  });
              } else {
                user
                  .update(attrs)
                  .proxy(emitter, { events: ['error'] })
                  .success(function(user) {
                    return emitter.emit('success', user);
                  });
              }
            });
        });
      }

    }
  });
};
