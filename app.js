var lib = require('./lib'),
    http = require('http'),
    morgan = require('morgan'),
    express = require('express'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    controllers = require('./controllers'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    methodOverride = require('method-override');

/**
 * Define base app and export it for testability
 */

var app = module.exports = express();

/**
 * Configure settings
 */

app.set('view engine', 'jade');
app.set('port', process.env.STALKER_PORT || 3000);
app.set('api token', process.env.API_TOKEN || 'please');
app.set('session secret', process.env.SESSION_SECRET || 'dirty secret');
app.set('passport key', process.env.CONSUMER_KEY);
app.set('passport secret', process.env.CONSUMER_SECRET);
app.set('passport host', 'localhost:' + app.get('port'));

/**
 * Configure passport strategy
 */

lib.middleware.passport(app);

/**
 * Configure middleware
 */

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser());
app.use(expressSession({ secret: app.get('session secret') }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api|\//', lib.middleware.authenticate(app));

/**
 * Development only settings
 */

if(app.get('env') === 'development') {
  app.use(morgan('dev'));
}

/**
 * Production only settings
 */

if(app.get('env') === 'production') {
  // Configure settings
  app.get('passport host', process.env.PASSPORT_HOST);

  // Configure middleware
  app.use(morgan('short'));
}

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

/**
 * Mount all controllers using our helper
 */

app.mount(controllers(app));

/**
 * Start the server if script was started directly
 */

if(!module.parent) {
  http.createServer(app).listen(app.get('port'), function() {
    console.log("Stalker started on port: " + app.get('port'));
  });
}
