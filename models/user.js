var utils = require('../lib/utils'),
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
      type: Types.DATE,
      defaultValue: null
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

        attrs.division = attrs.division_id;

        delete attrs.token;
        delete attrs.active;
        delete attrs.division_id;

        return attrs;
      },

      /**
       * Serialize a user for session on the client
       *
       * @return {Object}
       */

      toSession: function() {
        return utils.extend(this.toJSON(), {
          token: this.values.token
        });
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
       *   User.authorize({ username: 'waldo', name: 'Waldo' }, 'abc123').complete(...)
       *
       * @param {Object} profile attributes of the user
       * @param {String} token oauth auth token
       * @return {Sequelize.Utils.CustomEventEmitter}
       */

      authorize: function(profile, token) {
        var User = this;
        var attrs = {
          token: token
        };

        // Update attributes
        if(profile.role) attrs.role = profile.role;
        if(profile.avatar) attrs.avatar = profile.avatar;
        if(profile.displayName) attrs.name = profile.displayName;

        return new Emitter(function(emitter) {
          User
            .find({ where: { username: profile.username } })
            .proxy(emitter, { events: ['error'] })
            .success(function(user) {
              if(!user) {
                attrs.username = profile.username;

                User
                  .create(attrs)
                  .proxy(emitter, { events: ['error'] })
                  .success(function(user) {
                    return emitter.emit('success', user);
                  });
              } else {
                user
                  .updateAttributes(attrs)
                  .proxy(emitter, { events: ['error'] })
                  .success(function(user) {
                    return emitter.emit('success', user);
                  });
              }
            });
        }).run();
      }
    }
  });
};
