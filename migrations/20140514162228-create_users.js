module.exports = {
  up: function(migration, Types, done) {
    migration.createTable('Users', {
      id: {
        type: Types.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      division_id: {
        type: Types.INTEGER,
        allowNull: true
      },

      name: {
        type: Types.STRING,
        allowNull: false
      },

      username: {
        type: Types.STRING,
        unique: true,
        allowNull: false
      },

      role: {
        type: Types.STRING,
        allowNull: false,
        defaultValue: 'member'
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

      status: {
        type: Types.INTEGER,
        defaultValue: 0
      },

      back: {
        type: Types.DATE,
        defaultValue: null
      },

      token: {
        type: Types.STRING,
        defaultValue: null
      },

      created_at: Types.DATE,
      updated_at: Types.DATE
    });

    return done();
  },

  down: function(migration, Types, done) {
    migration.dropTable('Users');

    return done();
  }
};
