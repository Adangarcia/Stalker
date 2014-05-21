/**
 * Export for `sequelize.import` usage
 */

module.exports = function(sequelize, Types) {

  /**
   * Division model
   *
   * Division, has many users
   */

  return sequelize.define('Division', {
    name: {
      type: Types.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  });
};
