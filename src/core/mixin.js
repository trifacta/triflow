var _ = require('underscore');

var mixin = function(func, parent) {
  func.prototype = _.defaults(func.prototype, parent.prototype);
  return func;
};

module.exports = mixin;
