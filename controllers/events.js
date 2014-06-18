var models = require('../models'),
    User = models.User,
    Division = models.Division;

/**
 * A socket connection to a client
 *
 * @param {http.Request} req
 * @param {http.Response} res
 * @return {Client}
 */

function Client(req, res) {
  this.req = req;
  this.res = res;

  return this;
}

/**
 * Acknowledge the newly connected client
 *
 * @return {Client}
 */

Client.prototype.negotiate = function negotiate() {
  var self = this;

  this.res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
  });

  this.res.write("retry: 2000\n");
  this.heartbeat = setInterval(function() {
    self.send(Date.now(), 'heartbeat', Date.now());
  }, 10000);

  return this;
};

/**
 * Send `data` to the client
 *
 * @param {Number} id
 * @param {String} type
 * @param {String} data
 * @return {Client}
 */

Client.prototype.send = function send(id, type, data) {
  this.res.write('id: ' + id + '\n');
  this.res.write('event: ' + type + '\n');
  this.res.write('data: ' + data + '\n\n');

  return this;
};

/**
 * Destroy the client, setting clearing the heartbeat interval
 *
 * @return {null}
 */

Client.prototype.destroy = function destroy() {
  clearInterval(this.heartbeat);

  return null;
};


/**
 * Object array for managing server events and clients
 */

function SSE() {
  this.clients = [];

  return this;
}

/**
 * Add the `id` to clients
 *
 * @param {http.Request} req
 * @param {http.Response} res
 * @return {SSE}
 */

SSE.prototype.add = function add(req, res) {
  var clients = this.clients,
      client = new Client(req, res);

  // Destroy the client on connection close
  req.on('close', function() {
    var i = 0, len = clients.length;

    for(; i < len; i++) {
      if(clients[i] === client) {
        clients.splice(i, 1)[0].destroy();
        break;
      }
    }
  });

  // Save client
  clients.push(client);

  return client;
};

/**
 * Send `data` to all connected clients
 *
 * @param {String} type
 * @param {Object} data
 * @return {SSE}
 */

SSE.prototype.send = function send(type, data) {
  var i = 0, len = this.clients.length,
      id = Date.now(), message = JSON.stringify(data);

  for(; i < len; i++) {
    this.clients[i].send(id, type, message);
  }

  return this;
};

/**
 * Define our new socket manager
 */

var sockets = new SSE();

/**
 * Negotiate a client target for server events
 *
 * @param {http.Request} req
 * @param {http.Response} res
 */

module.exports = function(req, res) {
  if(!req.accepts('text/event-stream')) {
    return res.json(406);
  }

  sockets.add(req, res).negotiate();
};

/**
 * Send a specific event to connected clients
 *
 * @param {String} type
 * @return {Function} (model, next)
 *   @param {Object} model
 *   @param {Function} next
 */

function sendEvent(type) {
  return function(model, next) {
    sockets.send(type, model);

    return next(null, model);
  };
}

// TODO: Add destroy event
User.afterCreate(sendEvent('user'));
User.afterUpdate(sendEvent('user'));
Division.afterCreate(sendEvent('division'));
Division.afterUpdate(sendEvent('division'));
