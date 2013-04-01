var _ = require('underscore');

var extend = module.exports = function(func, parent) {
  if (parent) {
    var p = parent;
    _.defaults(func.prototype, p.prototype);
    func.prototype.__super__ = function() {
      // Temporarily change the __super__ to
      // parents super for cascading __super__ cals.
      var temp = this.__super__;
      this.__super__ = p.prototype.__super__;
      p.apply(this, arguments);
      this.__super__ = temp;
    };
  }
  return func;
};
