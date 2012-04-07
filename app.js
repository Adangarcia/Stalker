var flatiron = require('flatiron'),
    controllers = require('./lib/controllers'),
    app = flatiron.app;

app.use(flatiron.plugins.http);

// Route request to correct controller
app.router.path(/users/i, controllers.User);

// Start the app
app.start(3000);