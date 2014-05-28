/**
 * Pages routes
 */

module.exports = {

  /**
   * Index route, renders the index page or redirects to `/login`
   *
   * @param {http.Request}
   * @param {http.Response}
   */

  index: function(req, res) {
    if(!req.user) return res.redirect('/login');
    return res.render('index', {
      user: req.user
    });
  },

  /**
   * Login route, renders the login page or redirects to `/`
   *
   * @param {http.Request}
   * @param {http.Response}
   */

  login: function(req, res) {
    if(req.user) return res.redirect('/');
    return res.render('login');
  }

};
