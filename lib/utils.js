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
