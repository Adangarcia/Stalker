var express = require('express'),
    controllers = require('controllers');

/**
 * Base configuration
 */

app.configure(function() {
  // Configure settings
  app.set('port', process.env.STALKER_PORT || 3000);
  app.set('api token', process.env.API_TOKEN || 'please');
  app.set('passport key', process.env.CONSUMER_KEY);
  app.set('passport secret', process.env.CONSUMER_SECRET);
  app.get('passport host', 'localhost');

  // Configure middleware
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.logger('dev'));
});

app.configure('production', function() {
  // Configure settings
  app.get('passport host', process.env.PASSPORT_HOST);

  // Configure middleware
  app.use(express.logger('short'));
});

/**
 * Helper function for mounting routes
 *
 * @param {Object|Function} handler
 * @param {String} route optional
 */

app.mount = function(handler, route) {
  route = route || '';

  for(var k in handler) {
    if(typeof handler[k] === 'function') {
      this[k](route, handler[k]);
    } else {
      this.mount(handler[k], route + k);
    }
  }
};

// Mount all controllers
app.mount(controllers);

/**
 * Start the server
 */

http.createServer(app).listen(app.get('port'), function() {
  console.log("Stalker started on port: " + app.get('port'));
});
