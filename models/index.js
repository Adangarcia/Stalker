/**
 * Module dependencies
 */

var Sequelize = require('sequelize');

/**
 * Locals for db and env
 */

var user, password,
    database, sequelize,
    env = process.env.NODE_ENV || 'development';

/**
 * Base options for sequelize
 */

var options = {
  logging: false,

  define: {
    charset: 'utf8',
    timestamps: true,
    underscored: true
  }
};

/**
 * Load sequelize and models
 */

if(env == 'production') {
  user = process.env.DB_USER;
  password = process.env.DB_PASSWORD;
  database = process.env.DB_DATABASE || 'stalker';

  options.dialect = 'postgres';
  options.host = process.env.DB_HOST || 'localhost';
} else {
  user = 'root';
  password = '';
  database = 'stalker_development';

  options.dialect = 'sqlite';
  options.storage = '/tmp/stalker_test.sqlite';
}

sequelize = new Sequelize(database, user, password, options);

/**
 * Export our models
 */

var models = module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  User: sequelize.import(__dirname + '/user'),
  Division: sequelize.import(__dirname + '/division')
};

/**
 * Set up model associations
 */

models.Division
  .hasMany(models.User);

models.User
  .belongsTo(models.Division);
