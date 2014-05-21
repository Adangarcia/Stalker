var Division = require('../../models').Division;

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
      if(err) return res.json(500, { error: err });
      if(!division) return res.json(404, { error: 'not found' });

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
    Division.findAll().complete(function(err, divisions) {
      if(err) return res.json(500, { error: err });
      return res.json(200, divisions);
    });
  },

  /**
   * Create route - create a new division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  create: function(req, res) {
    Division.create(req.body).complete(function(err, division) {
      if(err) return res.json(500, { error: err });
      return res.json(201, division);
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

    return res.json(division);
  },

  /**
   * Update route - update specific division
   *
   * @param {http.Request} req
   * @param {http.Response} res
   */

  update: function(req, res) {
    var division = req.data.division;

    division.updateAttributes(req.body).complete(function(err, user) {
      if(err) return res.json(500, { error: err });
      return res.json(user);
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
      if(err) return res.json(500, { error: err });
      return res.send(204);
    });
  }

};
