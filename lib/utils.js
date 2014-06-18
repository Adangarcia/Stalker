/**
 * Expose our utility functions
 */

var utils = module.exports;

/**
 * Clone an object, returning a new object
 *
 * @param {Object} obj
 */

utils.clone = function(obj) {
  var child = {};

  for(var k in obj) {
    child[k] = obj[k];
  }

  return child;
};

/**
 * Normalize errors to return to the client
 * - Not really concerned with performance here,
 *   so the more verbose method was used
 *
 * @param {Object} error
 * @return {Object}
 */

utils.normalizeErrors = function(error) {
  return Object.keys(error)
    .filter(function(k) {
        return Array.isArray(error[k]) && !k.match(/^_+/);
    })
    .reduce(function(ret, k) {
      ret[k] = error[k];

      return ret;
    }, {});
};
