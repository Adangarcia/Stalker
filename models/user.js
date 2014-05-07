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
    token: Types.STRING,
    location: Types.STRING,
    returning: Types.STRING,

    name: {
      type: Types.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },

    username: {
      type: Types.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },

    role: {
      type: Types.STRING,
      defaultValue: 'member',
      validate: {
        notNull: true,
        notEmpty: true
      }
    },

    avatar: {
      type: Types.STRING,
      validate: {
        isUrl: true
      }
    },

    active: {
      type: Types.BOOLEAN,
      defaultValue: true,
      validate: {
        notNull: true
      }
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
        var attrs = this.values;

        delete attrs.token;

        return attrs;
      }
    }
  });
};
