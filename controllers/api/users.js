var utils = require('../../lib/utils'),
    User = require('../../models').User,
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
      if(err) return res.json(500, { errors: utils.normalizeErrors(err) });
      if(!user) return res.json(404, { errors: ['not found'] });

      req.data = req.data || {};
      req.data.user = user;
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
    User.findAll({ where: req.query }).complete(function(err, users) {
      if(err) return res.json(500, { errors: utils.normalizeErrors(err) });
      return res.json(200, { users: users });
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

    return res.json({ user: user });
  },

  /**
   * Update route - update specific user
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  update: function(req, res) {
    var user = req.data.user,
        attrs = req.body.user;

    if(attrs === undefined || attrs === null) {
      return res.json(422, {
        errors: ['invalid user data']
      });
    }

    // Turn division to division_id and run parseInt on it
    if(attrs.division) {
      attrs.division_id = parseInt(attrs.division, 10);
      delete attrs.division;
    }

    user.updateAttributes(attrs).complete(function(err, user) {
      if(err) return res.json(500, { errors: utils.normalizeErrors(err) });
      return res.json({ user: user });
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
      if(err) return res.json(500, { errors: utils.normalizeErrors(err) });
      return res.send(204);
    });
  }

};
