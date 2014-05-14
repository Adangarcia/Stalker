module.exports = {
  up: function(migration, Types, done) {
    migration.createTable('Divisions', {
      id: {
        type: Types.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: Types.STRING,
        allowNull: false
      },

      created_at: Types.DATE,
      updated_at: Types.DATE
    });
  },
  down: function(migration, Types, done) {
    migration.dropTable('Divisions');

    return done();
  }
};
