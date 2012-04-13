module.exports = function(publisher) {
  var controllers = {
    User: require('./users')(publisher)
  };

  return controllers;
};