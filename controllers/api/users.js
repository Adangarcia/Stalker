/**
 * Module dependencies
 */

var User = require('../../models').User,
    Division = require('../../models').Division;

/**
 * Return User routes
 */

module.exports = {

  /**
   * Index route - return all users
   */

  index: function(req, res) {
    User.findAll({ include: [ Division ] }).complete(function(err, users) {
      if(err) return res.json(500, { error: err });
      return res.json(200, users);
    });
  },

  get: function(req, res) {
    var id = req.params.id;

    User.find(id).complete(function(err, user) {
      if(err) return res.json(500, { error: err });
      if(!user) return res.json(404, { error: 'Not found' });
      return res.json(200, user);
    });
  },

  update: function(req, res) {

  },

  destroy: function(req, res) {

  }
};
