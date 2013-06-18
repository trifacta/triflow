var _ = require('underscore');

var extend = function(func, parent) {
  if (_([func, parent]).any(function(arg) { return !_.isFunction(arg); })) {
    throw new Error(func + ' cannot extend ' + parent);
  }

  func.prototype = _(new (_(function() {}).tap(function(surrogate) {
    surrogate.prototype = parent.prototype;
  }))()).tap(function(baseProto) {
    _.extend(baseProto, func.prototype, {
      constructor: func,
      __super__: function() {
        // Temporarily change the __super__ to
        // parents super for cascading __super__ cals.
        var temp = this.__super__;
        this.__super__ = parent.prototype.__super__;
        parent.apply(this, arguments);
        this.__super__ = temp;
      }
    });
  });

  return func;
};

module.exports = extend;
