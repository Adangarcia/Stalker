var flatiron = require('flatiron'),
    controllers = require('./lib/controllers'),
    redis = require('redis'),
    events = require('events').EventEmitter,
    pubEvents = require('node-redis-events').Publisher,
    url = require('url'),
    app = flatiron.app;

app.use(flatiron.plugins.http);

/**
 * Use Node-Redis-Events to publish
 * events to subscribers
 */

var eventEmitter = new events();

var model_events = [
  'user:save',
  'user:update'
];

var redisString = process.env.REDIS_URI || "redis://127.0.0.1:6379",
    redisURI = url.parse(redisString, true);

var pubSubConfig = {
  redis: redis.createClient(parseInt(redisURI.port, 10), redisURI.hostname),
  emitter: eventEmitter,
  namespace: 'stalker'
};

var publisher = new pubEvents(pubSubConfig, model_events);

// Route request to correct controller
app.controllers = controllers(eventEmitter);

app.router.path(/users/i, app.controllers.User);

// Start the app
app.start(process.env.STALKER_PORT || 3000);