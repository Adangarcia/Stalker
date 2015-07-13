var utils = require('../../lib/utils'),
    User = require('../../models').User,
    Division = require('../../models').Division;

/**
 * Return Division routes
 */

module.exports = {

  /**
   * Param handler for division_id
   *
   * @param {http.Request} req
   * @param {http.Response} res
   * @param {Function} next
   * @param {Number} id
   */

  param: function(req, res, next, id) {
    Division.find(id).complete(function(err, division) {
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      if(!division) {
        res.status(404);
        res.json({ errors: ['not found'] });

        return;
      }

      req.data = req.data || {};
      req.data.division = division;

      return next();
    });
  },

  /**
   * Index route - return all divisions
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  index: function(req, res) {
    Division.all(User, req.query).complete(function(err, divisions) {
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      res.json({ divisions: divisions });
    });
  },

  /**
   * Create route - create a new division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  create: function(req, res) {
    var attrs = req.body.division;

    if(attrs === undefined || attrs === null) {
      res.status(422);
      res.json({
        errors: ['invalid division']
      });

      return;
    }

    Division.create(attrs).complete(function(err, division) {
      if(err) {
        res.status(400);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      res.status(201);
      res.json({ division: division });
    });
  },

  /**
   * Get route - return specific division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  get: function(req, res) {
    var division = req.data.division;

    return res.json({ division: division });
  },

  /**
   * Update route - update specific division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  update: function(req, res) {
    var division = req.data.division,
        attrs = req.body.division;

    if(attrs === undefined || attrs === null) {
      res.status(422);
      res.json({
        errors: ['invalid division']
      });

      return;
    }

    division.update(attrs).complete(function(err, division) {
      if(err) {
        res.status(400);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      res.json({ division: division });
    });
  },

  /**
   * Destroy route - destroy specific division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  destroy: function(req, res) {
    var division = req.data.division;

    division.destroy().complete(function(err) {
      if(err) {
        res.status(500);
        res.json({ errors: utils.normalizeErrors(err) });

        return;
      }

      return res.sendStatus(204);
    });
  }

};
