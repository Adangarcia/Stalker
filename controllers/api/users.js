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
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      if(!user) {
        res.status(404);
        res.json({ errors: ['not found'] });

        return;
      }

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
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      res.json({ users: users });
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

    res.json({ user: user });
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
      res.status(422);
      res.json({ errors: ['invalid user data'] });

      return;
    }

    // Turn division to division_id and run parseInt on it
    if(attrs.division) {
      attrs.division_id = parseInt(attrs.division, 10);
      delete attrs.division;
    }

    // No, you cant update your role
    if(attrs.role !== undefined) {
      delete attrs.role;
    }

    // Run parseInt on last_edited_by id
    if(attrs.last_edited_by !== undefined) {
      attrs.last_edited_by = parseInt(attrs.last_edited_by, 10);
    }

    user.updateAttributes(attrs).complete(function(err, user) {
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

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
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      return res.sendStatus(204);
    });
  }

};
