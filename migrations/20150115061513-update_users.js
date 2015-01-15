module.exports = {
  up: function(migration, Types, done) {
    migration.addColumn(
      'Users',
      'last_edited_by',
      {
        type: Types.STRING,
        allowNull: true
    });

    return done();
  },

  down: function(migration, Types, done) {
    migration.removeColumn('Users','last_edited_by');
    
    return done();
  }
};
