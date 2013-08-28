var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var Filter = function(attr, outputs) {
  attr = attr || {};
  _.defaults(attr, {
    row: null
  });
  this.__super__(attr, outputs);
  this._predicate = attr.row;
};

var prototype = Filter.prototype;

prototype.consume = function(data, source) {
  if (this.callFunction(this._predicate, data)) {
    this.produce(data);
  }
};

module.exports = extend(Filter, TupleElement);
