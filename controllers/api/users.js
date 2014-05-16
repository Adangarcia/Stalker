var User = require('../../models').User,
    Division = require('../../models').Division;

/**
 * Return User routes
 */

module.exports = {

  /**
   * Param handler for user_id
   *
   * @param {http.Request} req
   * @param {http.Response} res
   * @param {Function} next
   * @param {Number} id
   */

  param: function(req, res, next, id) {
    User.find(id).complete(function(err, user) {
      if(err) return res.json(500, { error: err });
      if(!user) return res.json(404, { error: 'not found' });

      req.data = req.data || {};
      req.user = user;
      return next();
    });
  },

  /**
   * Index route - return all users
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  index: function(req, res) {
    User.findAll({ include: [ Division ] }).complete(function(err, users) {
      if(err) return res.json(500, { error: err });
      return res.json(200, users);
    });
  },

  /**
   * Create route - create a new user
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  create: function(req, res) {
    User.create(req.body).complete(function(err, user) {
      if(err) return res.json(500, { error: err });
      return res.json(201, user);
    });
  },

  /**
   * Get route - return specific user
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  get: function(req, res) {
    var user = req.data.user;

    return res.json(user);
  },

  /**
   * Update route - update specific user
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  update: function(req, res) {
    var user = req.data.user;

    user.update(req.body).complete(function(err, user) {
      if(err) return res.json(500, { error: err });
      return res.json(user);
    });
  },

  /**
   * Destroy route - destroy specific user
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  destroy: function(req, res) {
    var user = req.data.user;

    user.destroy().complete(function(err) {
      if(err) return res.json(500, { error: err });
      return res.send(204);
    });
  }

};